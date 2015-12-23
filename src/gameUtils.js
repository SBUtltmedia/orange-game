import model from './model';
import _ from 'lodash';
import { deepDifference, deepIndexOf, addObjectKey, addObjectKeys, addOriginalObjectKeys, average } from './utils';
import { CREATING, OPEN, ACCEPTED, REJECTED, PAID_BACK } from './constants/NegotiationStates';
import { ORANGES_FOUND, ORANGE_MOVED, PLAYER_DONE, GAME_STARTED, CHAT, LOAN } from '../src/constants/EventTypes';
import { MAX_FITNESS_GAIN, DAILY_FITNESS_LOSS, DAYS_IN_GAME, STARTING_FITNESS, DEFAULT_LOAN_ORANGES } from './constants/Settings';

export function getGame(appData, id) {
    if (appData) {
        const { games } = appData;
        if (games) {
            return games[id];
        }
    }
}

export function getThisGame(appData) {
    return getGame(appData, model.gameId);
}

export function getPlayer(appData, gameId, authId) {
    const game = getGame(appData, gameId);
    if (game) {
        return game.players[authId];
    }
}

export function getThisPlayer(appData) {
    const game = getThisGame(appData);
    if (game) {
        const player = game.players[model.authId];
        return addObjectKey(game.players, player, 'authId');
    }
}


/**
 * Returns all games in the system, with their IDs
 */
export function getAllGames(appData) {
    return addObjectKeys(appData.games);
}

/**
 * Returns all users in the system, with their IDs
 */
export function getAllUsers(appData) {
    return addObjectKeys(appData.users);
}

/**
 * Get chat messages in a game
 */
export function getChat(appData, gameId) {
    const chatEvents = getEventsInGame(appData, gameId, CHAT);
    return _.omit(chatEvents, 'type');
}

/**
 * Get chat messages in the current game
 */
export function getChatInThisGame(appData) {
    return getChat(appData, model.gameId);
}

/**
 * Only get events occuring after start and before end
 */
function filterEventsWithinTime(events, start, end) {
    return _.filter(events, e => e.time >= start && e.time <= end);
}

/**
 * Only get events occuring before a time
 */
function filterEventsBeforeTime(events, time) {
    return filterEventsWithinTime(events, 0, time);
}

/**
 * Only get events occuring after a time
 */
function filterEventsAfterTime(events, time) {
    return filterEventsWithinTime(events, time, Number.MAX_VALUE);
}

/**
 * Gets events in a given game with a given type, or any type if eventType null
 */
export function getEventsInGame(appData, gameId, eventType=null, startTime=0, endTime=Number.MAX_VALUE) {
    const game = getGame(appData, gameId);
    const events = filterEventsWithinTime(game.events, startTime, endTime);
    if (game) {
        if (eventType) {
            return _.filter(events, e => e.type === eventType);
        }
        else {
            return _.values(events);
        }
    }
}

/**
 * Gets events in the current game with a given type, or any type if eventType null
 */
export function getEventsInThisGame(appData, eventType) {
    return getEventsInGame(appData, model.gameId, eventType);
}

/**
 * Gets a player's reputation value
 */
export function getReputation(appData, gameId, authId) {
    const thisPlayerLoanBalance = getPlayerLoanBalance(appData, gameId, authId);
    const game = getGame(appData, gameId);
    const avgLoanBalance = average(_.map(_.keys(game.players), authId =>
                    Math.abs(getPlayerLoanBalance(appData, gameId, authId))));
    if (avgLoanBalance === 0) {
        return "good";
    }
    const x = thisPlayerLoanBalance / avgLoanBalance;
    if (x >= 0) {
        return "very_good";
    }
    if (x <= -3) {
        return "very_bad";
    }
    if (x <= -2) {
        return "bad";
    }
    if (x <= -1) {
        return "ehh";
    }
    return "good";
}

/**
 * Gets the current player's reputation value
 */
export function getMyReputation(appData) {
    return getReputation(appData, model.gameId, model.authId);
}

export function getDayStart(appData, gameId, authId, day) {
    if (day) {
        const foundEvents = getEventsInGame(appData, gameId, ORANGES_FOUND);
        const playerFoundEvents = _.filter(foundEvents, e => e.authId === authId);
        if (_.size(playerFoundEvents) >= day) {
            return playerFoundEvents[day - 1].time;
        }
        else {
            return Number.MAX_VALUE;
        }
    }
    return 0;
}

export function getDayEnd(appData, gameId, authId, day) {
    if (day) {
        const doneEvents = getEventsInGame(appData, gameId, PLAYER_DONE);
        const playerDoneEvents = _.filter(doneEvents, e => e.authId === authId);
        if (_.size(playerDoneEvents) >= day) {
            return playerDoneEvents[day - 1].time;
        }
    }
    return Number.MAX_VALUE;
}

export function getLoansBorrowed(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return _.filter(getEventsInGame(appData, gameId, LOAN.ACCEPTED, startTime, endTime), e => e.borrower === authId);
}

export function getLoansLended(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return _.filter(getEventsInGame(appData, gameId, LOAN.ACCEPTED, startTime, endTime), e => e.lender === authId);
}

export function getLoanPaymentsPaid(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const ts = getPlayerPaidOffTransactions(appData, gameId, authId, startTime, endTime);
    return _.sum(_.map(_.filter(ts, t => t.borrower === authId), t => t.oranges.later));
}

export function getLoanPayementsReceived(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const ts = getPlayerPaidOffTransactions(appData, gameId, authId, startTime, endTime);
    return _.sum(_.map(_.filter(ts, t => t.lender === authId), t => t.oranges.later));
}

export function getMyLoansBorrowed(appData) {
    return getMyLoansBorrowed(appData, model.gameId, model.authId);
}

export function getMyLoansLended(appData) {
    return getMyLoansLended(appData, model.gameId, model.authId);
}

export function getOrangesBorrowed(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const loans = getLoansBorrowed(appData, gameId, authId);
    return _.sum(_.map(loans, loan => loan.oranges.now));
}

export function getOrangesLended(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const loans = getLoansLended(appData, gameId, authId, startTime, endTime);
    return _.sum(_.map(loans, loan => loan.oranges.now));
}

export function getOrangesOwedToPlayer(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const loans = getLoansLended(appData, gameId, authId, startTime, endTime);
    return _.sum(_.map(loans, loan => loan.oranges.later));
}

export function getOrangesOwedFromPlayer(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const loans = getLoansBorrowed(appData, gameId, authId, startTime, endTime);
    return _.sum(_.map(loans, loan => loan.oranges.later));
}

function getOrangeDropEvents(prop, appData, name, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const events = getEventsInGame(appData, gameId, ORANGE_MOVED, startTime, endTime);
    return _.filter(events, e => e[prop] === name && e.authId === authId);
}

function getOrangesDropped(prop, appData, name, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return _.size(getOrangeDropEvents(prop, appData, name, gameId, authId, startTime, endTime));
}

function getOrangeDropInEvents(appData, name, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropEvents('dest', appData, name, gameId, authId, startTime, endTime);
}

function getOrangesDroppedIn(appData, name, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDropped('dest', appData, name, gameId, authId, startTime, endTime);
}

function getOrangeDropFromEvents(appData, name, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropEvents('src', appData, name, gameId, authId, startTime, endTime);
}

function getOrangesDroppedFrom(appData, name, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDropped('src', appData, name, gameId, authId, startTime, endTime);
}

export function getOrangeDropInDishEvents(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropInEvents(appData, 'dish', gameId, authId, startTime, endTime);
}

export function getOrangeDropInBasketEvents(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropInEvents(appData, 'basket', gameId, authId, startTime, endTime);
}

export function getOrangeDropInBoxEvents(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropInEvents(appData, 'box', gameId, authId, startTime, endTime);
}

export function getOrangeDropFromDishEvents(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropFromEvents(appData, 'dish', gameId, authId, startTime, endTime);
}

export function getOrangeDropFromBasketEvents(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropFromEvents(appData, 'basket', gameId, authId, startTime, endTime);
}

export function getOrangeDropFromBoxEvents(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangeDropFromEvents(appData, 'box', gameId, authId, startTime, endTime);
}

export function getOrangesDroppedInDish(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDroppedIn(appData, 'dish', gameId, authId, startTime, endTime);
}

export function getOrangesDroppedInBasket(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDroppedIn(appData, 'basket', gameId, authId, startTime, endTime);
}

export function getOrangesDroppedInBox(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDroppedIn(appData, 'box', gameId, authId, startTime, endTime);
}

export function getOrangesDroppedFromDish(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDroppedFrom(appData, 'dish', gameId, authId, startTime, endTime);
}

export function getOrangesDroppedFromBasket(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDroppedFrom(appData, 'basket', gameId, authId, startTime, endTime);
}

export function getOrangesDroppedFromBox(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getOrangesDroppedFrom(appData, 'box', gameId, authId, startTime, endTime);
}

export function getOrangesEatenOnDay(appData, gameId, authId, day) {
    const startTime = getDayStart(appData, gameId, authId, day);
    const endTime = getDayEnd(appData, gameId, authId, day);
    return getOrangesDroppedInDish(appData, gameId, authId, startTime, endTime) -
           getOrangesDroppedFromDish(appData, gameId, authId, startTime, endTime);
}

export function getOrangesSavedOnDay(appData, gameId, authId, day) {
    const startTime = getDayStart(appData, gameId, authId, day);
    const endTime = getDayEnd(appData, gameId, authId, day);
    return getOrangesDroppedInBasket(appData, gameId, authId, startTime, endTime) -
           getOrangesDroppedFromBasket(appData, gameId, authId, startTime, endTime);
}

export function getOrangesInDish(appData, gameId, authId) {
    const day = getGameDay(appData, gameId);
    return getOrangesEatenOnDay(appData, gameId, authId, day);
}

export function getOrangesInMyDish(appData) {
    return getOrangesInDish(appData, model.gameId, model.authId);
}

export function getOrangesInBasket(appData, gameId, authId) {
    return getOrangesDroppedInBasket(appData, gameId, authId) -
           getOrangesDroppedFromBasket(appData, gameId, authId) -
           getOrangesLended(appData, gameId, authId) -
           getLoanPaymentsPaid(appData, gameId, authId);
}

export function getOrangesInMyBasket(appData) {
    return getOrangesInBasket(appData, model.gameId, model.authId);
}

export function getDailyOranges(appData, gameId, authId) {
    const orangesDealtEvents = getEventsInGame(appData, gameId, ORANGES_FOUND);
    const playerEvents = _.filter(orangesDealtEvents, e => e.authId === authId);
    return _.map(playerEvents, e => e.oranges);
}

export function getMyDailyOranges(appData) {
    return getDailyOranges(appData, model.gameId, model.authId);
}

function getOrangesDealt(appData, gameId, authId) {
    return _.sum(getDailyOranges(appData, gameId, authId));
}

export function getOrangesInBox(appData, gameId, authId) {
    return getOrangesDealt(appData, gameId, authId) +
           getOrangesDroppedInBox(appData, gameId, authId) -
           getOrangesDroppedFromBox(appData, gameId, authId) +
           getOrangesBorrowed(appData, gameId, authId) +
           getLoanPayementsReceived(appData, gameId, authId);
}

export function getOrangesInMyBox(appData) {
    return getOrangesInBox(appData, model.gameId, model.authId);
}

export function getOranges(appData, gameId, authId) {
    return {
        box: getOrangesInBox(appData, gameId, authId),
        basket: getOrangesInBasket(appData, gameId, authId),
        dish: getOrangesInDish(appData, gameId, authId)
    };
}

export function getMyOranges(appData) {
    return getOranges(appData, model.gameId, model.authId);
}

function getHighestEventCountByPlayer(appData, events, gameId) {
    const counts = _.map(_.groupBy(events, e => e.authId), _.size);
    if (_.isEmpty(counts)) {  // no players have any
        return 0;
    }
    else {
        return _.max(counts);
    }
}

function getLowestEventCountByPlayer(appData, events, gameId) {
    const counts = _.map(_.groupBy(events, e => e.authId), _.size);
    const game = getGame(appData, gameId);
    if (_.isEmpty(counts)) {  // no players have any
        return 0;
    }
    else if (_.size(counts) < _.size(game.players)) {  // some players have none
        return 0;
    }
    else {
        return _.min(counts);
    }
}

export function getGameDay(appData, gameId) {
    const foundEvents = getEventsInGame(appData, gameId, ORANGES_FOUND);
    return getHighestEventCountByPlayer(appData, foundEvents, gameId);
}

export function getThisGameDay(appData) {
    return getGameDay(appData, model.gameId);
}

export function getDayForTime(appData, gameId, time) {
    const foundEvents = getEventsInGame(appData, gameId, ORANGES_FOUND);
    const prevFoundEvents = filterEventsBeforeTime(foundEvents, time);
    return getHighestEventCountByPlayer(appData, prevFoundEvents, model.gameId);
}

export function getEventDay(appData, gameId, event) {
    return getDayForTime(appData, gameId, event.time);
}

function getFitnessGainForEatEventsInSameDay(numEatEvents) {
    return _.reduce(_.range(0, numEatEvents), function(total, i) { return total + MAX_FITNESS_GAIN - i }, 0)
}

function getFitnessGainForEatEvents(appData, gameId, eatEvents, uneatEvents) {
    return _.sum(_.map(_.range(1, DAYS_IN_GAME + 1), i => {
        const f = e => getEventDay(appData, gameId, e) === i;
        const numDailyEatEvents = _.size(_.filter(eatEvents, f));
        const numDailyUneatEvents = _.size(_.filter(uneatEvents, f));
        const n = numDailyEatEvents - numDailyUneatEvents;
        return getFitnessGainForEatEventsInSameDay(n);
    }));
}

function getFitnessAtTime(appData, gameId, authId, time) {
    const day = getDayForTime(appData, gameId, time);
    const eatEvents = getOrangeDropInDishEvents(appData, gameId, authId, 0, time);
    const uneatEvents = getOrangeDropFromDishEvents(appData, gameId, authId, 0, time);
    const fitnessGain = getFitnessGainForEatEvents(appData, gameId, eatEvents, uneatEvents);
    const fitnessLoss = (day - 1) * DAILY_FITNESS_LOSS;
    return STARTING_FITNESS + fitnessGain - fitnessLoss;
}

export function getFitnessAtEndOfDay(appData, gameId, authId, day) {
    const dayEnd = getDayEnd(appData, gameId, authId, day);
    return getFitnessAtTime(appData, gameId, authId, dayEnd);
}

export function getFitness(appData, gameId, authId) {
    const now = new Date().getTime();
    return getFitnessAtTime(appData, gameId, authId, now);
}

export function getMyFitness(appData) {
    return getFitness(appData, model.gameId, model.authId);
}

export function getFitnessChangeOnDay(appData, gameId, authId, day) {
    const startTime = getDayStart(day);
    const endTime = getDayEnd(day);
    const eatEvents = getOrangeDropInDishEvents(appData, gameId, authId, startTime, endTime);
    const uneatEvents = getOrangeDropFromDishEvents(appData, gameId, authId, startTime, endTime);
    const fitnessGain = getFitnessGainForEatEvents(appData, gameId, eatEvents, uneatEvents);
    return fitnessGain - (day > 1 ? DAILY_FITNESS_LOSS : 0);
}

export function getFitnessChangeToday(appData, gameId, authId) {
    return getFitnessChangeOnDay(appData, gameId, authId, getGameDay(appData, gameId));
}

export function getMyFitnessChangeToday(appData) {
    return getFitnessChangeToday(appData, model.gameId, model.authId);
}

export function getUser(appData, authId) {
    if (appData.users) {
        return appData.users[authId];
    }
}

export function getThisUser(appData) {
    return getUser(appData, model.authId);
}

export function updateThisPlayer(appData, playerData) {
    const newAppData = _.clone(appData);
    const game = getThisGame(newAppData);
    game.players[model.authId] = playerData;
    return newAppData;
}

function getPlayerTransactionsForState(appData, gameId, authId, state, startTime=0, endTime=Number.MAX_VALUE) {
    const ts = deriveTransactions(appData, gameId, authId, startTime, endTime);
    const completed = _.filter(ts, t => t.state === state);
    return addOriginalObjectKeys(ts, completed);
}

export function getPlayerOutstandingTransactions(appData, gameId, authId) {
    return getPlayerTransactionsForState(appData, gameId, authId, ACCEPTED);
}

export function getThisPlayerOutstandingTransactions(appData) {
    return getThisPlayerOutstandingTransactions(appData, model.authId);
}

export function getPlayerPaidOffTransactions(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    return getPlayerTransactionsForState(appData, gameId, authId, PAID_BACK, startTime, endTime);
}

export function getThisPlayerPaidOffTransactions(appData) {
    return getPlayerPaidOffTransactions(appData, model.authId);
}

export function getPlayerDebts(appData, gameId, authId) {
    return _.filter(getPlayerOutstandingTransactions(appData, gameId, authId), t => t.borrower === authId);
}

export function getThisPlayerDebts(appData) {
    return getPlayerDebts(appData, model.gameId, model.authId);
}

export function getPlayerCredits(appData, gameId, authId) {
    return _.filter(getPlayerOutstandingTransactions(appData, gameId, authId), t => t.lender === authId);
}

export function getThisPlayerCredits(appData) {
    return getPlayerCredits(appData, model.gameId, model.authId);
}

function getPlayerLoanBalanceAtTime(appData, gameId, authId, time) {
    return getOrangesOwedToPlayer(appData, gameId, authId, 0, time) -
           getOrangesOwedFromPlayer(appData, gameId, authId, 0, time) +
           getLoanPaymentsPaid(appData, gameId, authId, 0, time) -
           getLoanPayementsReceived(appData, gameId, authId, 0, time);
}

export function getThisPlayerLoanBalanceAtEndOfDay(appData, gameId, authId, day) {
    return getPlayerLoanBalanceAtTime(appData, gameId, authId, getDayEnd(day));
}

export function getPlayerLoanBalance(appData, gameId, authId) {
    const now = new Date().getTime();
    return getPlayerLoanBalanceAtTime(appData, gameId, authId, now);
}

export function getThisPlayerLoanBalance(appData) {
    return getPlayerTotalCreditsAndDebits(appData, model.gameId, model.authId);
}

export function canPlayerFinishDay(appData, gameId, authId) {
    return canPlayerFinishDayDerived(derivePlayer(appData, gameId, authId));
}

export function canIFinishDay(appData) {
    return canPlayerFinishDay(appData, model.gameId, model.authId);
}

export function shouldDealNewDay(appData) {
    const b = shouldDealNewDayDerived(deriveData(appData));
    return b;
}

export function isGameStarted(appData, gameId) {
    return !_.isEmpty(getEventsInGame(appData, gameId, GAME_STARTED));
}

export function isThisGameStarted(appData) {
    return isGameStarted(appData, model.gameId);
}

export function isGameFinished(appData, gameId) {
    return getGameDay(appData, gameId) > DAYS_IN_GAME;
}

export function isThisGameFinished(appData) {
    return isGameFinished(appData, model.gameId);
}

export function isGameRunning(appData, gameId) {
    return isGameStarted(appData, gameId) && !isGameFinished(appData, gameId);
}

export function isThisGameRunning(appData) {
    return isGameRunning(appData, model.gameId);
}

export function canPlayerFinishDayDerived(derivedPlayer) {
    if (!derivedPlayer) {
        return false;
    }
    return derivedPlayer.oranges.box === 0 && !derivedPlayer.ready;
}

export function shouldDealNewDayDerived(derivedData) {
    if (!derivedData || _.isEmpty(derivedData) || _.isEmpty(derivedData.players)) {
        return false;
    }
    return _.isEmpty(derivedData.dailyOranges) ||
           _.every(derivedData.players, p => p.ready);
}

export function derivePlayer(appData, gameId, authId) {
    const game = getGame(appData, gameId);
    if (game) {
        const doneEvents = getEventsInGame(appData, gameId, PLAYER_DONE);
        const playerDoneEvents = _.filter(doneEvents, e => e.authId === authId);
        const oranges = getOranges(appData, gameId, authId);
        return {
            authId: authId,
            name: game.players[authId].name,
            ready: oranges.box === 0 && _.size(playerDoneEvents) >= getGameDay(appData, gameId),
            oranges: oranges
        };
    }
}

export function derivePlayers(appData) {
    const game = getThisGame(appData);
    if (game) {
        return _.map(_.keys(game.players), authId =>
                derivePlayer(appData, model.gameId, authId));
    }
    else {
        return [];
    }
}

function areLoansSimilar(transaction1, transaction2) {
    return transaction1.lender === transaction2.lender &&
           transaction1.borrower === transaction2.borrower &&
           transaction1.oranges.now === transaction2.oranges.now &&
           transaction1.oranges.later === transaction2.oranges.later;
}

function getLoanPaymentEvent(appData, transaction) {
    const ts = deriveTransactions(appData, transaction.gameId, transaction.lender);
    const similar = _.filter(ts, t => areLoansSimilar(transaction, t));
    const payments = _.filter(getEventsInGame(appData, gameId, LOAN.PAID_BACK),
                                 e => areLoansSimilar(transaction, e));
    const index = () => {
        const n = _.size(similar);
        for (var i = 0; i < n; i++) {
            if (transaction.lastEventTime === similar[i].lastEventTime) {
                return i;
            }
        }
        throw new Error('Index not found');
    }();
    if (_.size(payments) > index) {
        return payments[index];
    }
}

export function shouldDisableOranges(appData, gameId, authId) {
    const f = e => e.authId === authId;
    const doneEvents = _.filter(getEventsInGame(appData, gameId, PLAYER_DONE), f);
    const foundEvents = _.filter(getEventsInGame(appData, gameId, ORANGES_FOUND), f);
    return _.size(doneEvents) >= _.size(foundEvents);
}

export function shouldDisableMyOranges(appData) {
    return shouldDisableOranges(appData, model.gameId, model.authId);
}

export function isPlayerDead(appData, gameId, authId) {
    return getFitness(appData, gameId, authId) <= 0;
}

export function isThisPlayerDead(appData) {
    return isPlayerDead(appData, model.gameId, model.authId);
}

function isLoanPaidOff(appData, transaction) {
    return !!getLoanPaymentEvent(appData, transaction);
}

export function canPayOffLoan(appData, transaction) {
    const borrower = derivePlayer(appData, transaction.gameId, transaction.borrower);
    return borrower.oranges.basket >= transaction.oranges.later;
}

function getEventsInTransaction(appData, gameId, event) {
    return _.filter(getEventsInGame(appData, gameId), e =>
                                    e.transactionId === event.transactionId);
}

function getTransactionState(event) {
    switch (event.type) {
        case LOAN.OFFER_WINDOW_OPENED:
        case LOAN.ASK_WINDOW_OPENED: return CREATING;
        case LOAN.PAID_BACK: return PAID_BACK;
        case LOAN.ACCEPTED: return ACCEPTED;
        case LOAN.REJECTED: return REJECTED;
        default: return OPEN;
    }
}

/**
 * Gets the transaction data from a single event in that transaction
 */
export function getTransactionForEvent(appData, gameId, event) {
    const lastEvent = _.last(getEventsInTransaction(appData, gameId, event));
    return {
        lender: event.lender,
        borrower: event.borrower,
        oranges: lastEvent.oranges || DEFAULT_LOAN_ORANGES,
        state: getTransactionState(lastEvent),
        lastToAct: lastEvent.authId,
        lastEventType: lastEvent.type,
        lastEventTime: lastEvent.time,
        id: lastEvent.transactionId,
        gameId: gameId
    };
}

function getTransactions(appData, gameId, authId, type) {
    const events = _.filter(getEventsInGame(appData, gameId, type),
                    e => e.borrower === authId || e.lender === authId);
    return _.map(events, e => getTransactionForEvent(appData, gameId, e));
}

export function deriveTransactions(appData, gameId, authId, startTime=0, endTime=Number.MAX_VALUE) {
    const openOfferEvents = _.filter(getEventsInGame(appData, gameId, LOAN.OFFER_WINDOW_OPENED),
                                        e => e.authId === authId, startTime, endTime);
    const openAskEvents = _.filter(getEventsInGame(appData, gameId, LOAN.ASK_WINDOW_OPENED),
                                        e => e.authId === authId);
    const offeredEvents = _.filter(getEventsInGame(appData, gameId, LOAN.OFFERED),
                                        e => e.borrower === authId);
    const askedEvents = _.filter(getEventsInGame(appData, gameId, LOAN.ASKED),
                                        e => e.lender === authId);
    return _.map(_.union(openOfferEvents, openAskEvents, offeredEvents, askedEvents),
                    e => getTransactionForEvent(appData, gameId, e));
}

export function deriveMyTransactions(appData) {
    return deriveTransactions(appData, model.gameId, model.authId);
}

export function deriveOpenTransactions(appData, gameId, authId) {
    const all = deriveTransactions(appData, gameId, authId);
    const closed = deriveClosedTransactions(appData, gameId, authId);
    return deepDifference(all, closed);
}

export function deriveMyOpenTransactions(appData) {
    return deriveOpenTransactions(appData, model.gameId, model.authId);
}

export function deriveCompletedTransactions(appData) {
    return getTransactions(appData, gameId, authId, LOAN.ACCEPTED);
}

export function deriveMyCompletedTransactions(appData) {
    return deriveCompletedTransactions(appData, model.gameId, model.authId);
}

export function deriveClosedTransactions(appData, gameId, authId) {
    return _.union(
        getTransactions(appData, gameId, authId, LOAN.ACCEPTED),
        getTransactions(appData, gameId, authId, LOAN.REJECTED));
}

export function deriveMyClosedTransactions(appData) {
    return deriveClosedTransactions(appData, model.gameId, model.authId);
}

export function deriveData(appData) {
    return {
        dailyOranges: getMyDailyOranges(appData),
        oranges: getMyOranges(appData),
        day: getThisGameDay(appData),
        players: derivePlayers(appData)
    };
}
