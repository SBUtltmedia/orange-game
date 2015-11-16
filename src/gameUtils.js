import model from './model';
import _ from 'lodash';
import { deepDifference, deepIndexOf, addObjectKey, addObjectKeys,
            addOriginalObjectKeys, average } from './utils';
import { CREATING, OPEN, ACCEPTED, REJECTED,
            PAID_OFF } from './constants/NegotiationStates';
import { ORANGES_DEALT, ORANGE_MOVED, PLAYER_DONE, GAME_STARTED,
            CHAT, LOAN } from '../src/constants/EventTypes';
import { MAX_FITNESS_GAIN, DAILY_FITNESS_LOSS, DAYS_IN_GAME, STARTING_FITNESS,
            DEFAULT_LOAN_ORANGES } from './constants/Settings';

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
 * Gets events in a given game with a given type, or any type if eventType null
 */
export function getEventsInGame(appData, gameId, eventType=null) {
    const game = getGame(appData, gameId);
    if (game) {
        if (eventType) {
            return _.filter(game.events, e => e.type === eventType);
        }
        else {
            return _.values(game.events);
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

function getTodayStart(appData, gameId, authId) {
    const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
    const playerDoneEvents = _.filter(doneEvents, e => e.authId === authId);
    return _.isEmpty(playerDoneEvents) ? 0 : _.last(playerDoneEvents).time;
}

export function getLoansBorrowed(appData, gameId, authId) {
    return _.filter(getEventsInGame(appData, gameId, LOAN.ACCEPTED),
                                e => e.borrower === authId);
}

export function getLoansLended(appData, gameId, authId) {
    return _.filter(getEventsInGame(appData, gameId, LOAN.ACCEPTED),
                                e => e.lender === authId);
}

export function getMyLoansBorrowed(appData) {
    return getMyLoansBorrowed(appData, model.gameId, model.authId);
}

export function getMyLoansLended(appData) {
    return getMyLoansLended(appData, model.gameId, model.authId);
}

export function getOrangesBorrowed(appData, gameId, authId) {
    const loans = getLoansBorrowed(appData, gameId, authId);
    return _.sum(_.map(loans, loan => loan.oranges.now));
}

export function getOrangesLended(appData, gameId, authId) {
    const loans = getLoansLended(appData, gameId, authId);
    return _.sum(_.map(loans, loan => loan.oranges.now));
}

export function getOrangesOwedToPlayer(appData, gameId, authId) {
    const loans = getLoansBorrowed(appData, gameId, authId);
    return _.sum(_.map(loans, loan => loan.oranges.later));
}

export function getOrangesOwedFromPlayer(appData, gameId, authId) {
    const loans = getLoansLended(appData, gameId, authId);
    return _.sum(_.map(loans, loan => loan.oranges.later));
}

function getOrangeDropEvents(prop, appData, name, gameId, authId, onlyToday) {
    const events = getEventsAfterTime(
                        getEventsInGame(appData, gameId, ORANGE_MOVED),
                        onlyToday ? getTodayStart(appData, gameId, authId) : 0);
    return _.filter(events, e => e[prop] === name && e.authId === authId);
}

function getOrangesDropped(prop, appData, name, gameId, authId, onlyToday) {
    return _.size(getOrangeDropEvents(prop, appData, name, gameId, authId, onlyToday));
}

function getOrangeDropInEvents(appData, name, gameId, authId, onlyToday) {
    return getOrangeDropEvents('dest', appData, name, gameId, authId, onlyToday);
}

function getOrangesDroppedIn(appData, name, gameId, authId, onlyToday) {
    return getOrangesDropped('dest', appData, name, gameId, authId, onlyToday);
}

function getOrangeDropFromEvents(appData, name, gameId, authId, onlyToday) {
    return getOrangeDropEvents('src', appData, name, gameId, authId, onlyToday);
}

function getOrangesDroppedFrom(appData, name, gameId, authId, onlyToday) {
    return getOrangesDropped('src', appData, name, gameId, authId, onlyToday);
}

export function getOrangeDropInDishEvents(appData, gameId, authId) {
    return getOrangeDropInEvents(appData, 'dish', gameId, authId);
}

export function getOrangeDropInBasketEvents(appData, gameId, authId) {
    return getOrangeDropInEvents(appData, 'basket', gameId, authId);
}

export function getOrangeDropInBoxEvents(appData, gameId, authId) {
    return getOrangeDropInEvents(appData, 'box', gameId, authId);
}

export function getOrangeDropFromDishEvents(appData, gameId, authId) {
    return getOrangeDropFromEvents(appData, 'dish', gameId, authId);
}

export function getOrangeDropFromBasketEvents(appData, gameId, authId) {
    return getOrangeDropFromEvents(appData, 'basket', gameId, authId);
}

export function getOrangeDropFromBoxEvents(appData, gameId, authId) {
    return getOrangeDropFromEvents(appData, 'box', gameId, authId);
}

export function getOrangesDroppedInDish(appData, gameId, authId) {
    return getOrangesDroppedIn(appData, 'dish', gameId, authId, true);
}

export function getOrangesDroppedInBasket(appData, gameId, authId) {
    return getOrangesDroppedIn(appData, 'basket', gameId, authId);
}

export function getOrangesDroppedInBox(appData, gameId, authId) {
    return getOrangesDroppedIn(appData, 'box', gameId, authId);
}

export function getOrangesDroppedFromDish(appData, gameId, authId) {
    return getOrangesDroppedFrom(appData, 'dish', gameId, authId, true);
}

export function getOrangesDroppedFromBasket(appData, gameId, authId) {
    return getOrangesDroppedFrom(appData, 'basket', gameId, authId);
}

export function getOrangesDroppedFromBox(appData, gameId, authId) {
    return getOrangesDroppedFrom(appData, 'box', gameId, authId);
}

export function getOrangesInDish(appData, gameId, authId) {
    return getOrangesDroppedInDish(appData, gameId, authId) -
           getOrangesDroppedFromDish(appData, gameId, authId);
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
    const orangesDealtEvents = getEventsInGame(appData, gameId, ORANGES_DEALT);
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

function getEventsBeforeTime(events, time) {
    return _.filter(events, e => e.time < time);
}

function getEventsAfterTime(events, time) {
    return _.filter(events, e => e.time > time);
}

export function getGameDay(appData, gameId) {
    const dealtEvents = getEventsInGame(appData, gameId, ORANGES_DEALT);
    return getHighestEventCountByPlayer(appData, dealtEvents, gameId);
}

export function getThisGameDay(appData) {
    return getGameDay(appData, model.gameId);
}

export function getEventDay(appData, event) {
    const doneEvents = getEventsInThisGame(appData, ORANGES_DEALT);
    const prevDoneEvents = getEventsBeforeTime(doneEvents, event.time);
    return getHighestEventCountByPlayer(appData, prevDoneEvents, model.gameId);
}

function getFitnessGainForEatEventsInSameDay(eatEvents) {
    var accum = 0;
    for (var i = 0; i < _.size(eatEvents); i++) {
        accum += MAX_FITNESS_GAIN - i;
    }
    return accum;
}

function getFitnessGainForEatEvents(appData, eatEvents) {
    return _.sum(_.map(_.range(1, DAYS_IN_GAME + 1), i =>
            getFitnessGainForEatEventsInSameDay(_.filter(eatEvents, e =>
                getEventDay(appData, e) === i))));
}

export function getFitness(appData, gameId, authId) {
    const eatEvents = getOrangeDropInDishEvents(appData, gameId, authId);
    const fitnessGain = getFitnessGainForEatEvents(appData, eatEvents);
    const day = getGameDay(appData, gameId);
    const fitnessLoss = (day - 1) * DAILY_FITNESS_LOSS;
    return STARTING_FITNESS + fitnessGain - fitnessLoss;
}

export function getMyFitness(appData) {
    return getFitness(appData, model.gameId, model.authId);
}

export function getFitnessChange(appData, gameId, authId) {
    const eatEvents = getOrangeDropInDishEvents(appData, gameId, authId, true);
    const fitnessGain = getFitnessGainForEatEvents(appData, eatEvents);
    const day = getGameDay(appData, gameId);
    return fitnessGain - (day > 1 ? DAILY_FITNESS_LOSS : 0);
}

export function getMyFitnessChange(appData) {
    return getFitnessChange(appData, model.gameId, model.authId);
}

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

function getPlayerTransactionsForState(appData, gameId, authId, state) {
    const ts = deriveTransactions(appData, gameId, authId);
    const completed = _.filter(ts, t => t.state === state);
    return addOriginalObjectKeys(ts, completed);
}

export function getPlayerOutstandingTransactions(appData, gameId, authId) {
    return getPlayerTransactionsForState(appData, gameId, authId, ACCEPTED);
}

export function getThisPlayerOutstandingTransactions(appData) {
    return getThisPlayerOutstandingTransactions(appData, model.authId);
}

export function getPlayerPaidOffTransactions(appData, gameId, authId) {
    return getPlayerTransactionsForState(appData, gameId, authId, PAID_OFF);
}

export function getThisPlayerPaidOffTransactions(appData) {
    return getPlayerPaidOffTransactions(appData, model.authId);
}

export function getPlayerDebts(appData, gameId, authId) {
    return _.filter(getPlayerOutstandingTransactions(appData, gameId, authId), t => {
        return t.borrower === authId;
    });
}

export function getThisPlayerDebts(appData) {
    return getPlayerDebts(appData, model.gameId, model.authId);
}

export function getPlayerCredits(appData, gameId, authId) {
    return _.filter(getPlayerOutstandingTransactions(appData, gameId, authId), t => {
        return t.lender === authId;
    });
}

export function getThisPlayerCredits(appData) {
    return getPlayerCredits(appData, model.gameId, model.authId);
}

export function getPlayerLoanBalance(appData, gameId, authId) {
    return getOrangesOwedToPlayer(appData, gameId, authId) -
           getOrangesOwedFromPlayer(appData, gameId, authId) +
           getLoanPaymentsPaid(appData, gameId, authId) -
           getLoanPayementsReceived(appData, gameId, authId);
}

export function getThisPlayerLoanBalance(appData) {
    return getPlayerTotalCreditsAndDebits(appData, model.gameId, model.authId);
}

export function getLoanPaymentsPaid(appData, gameId, authId) {
    const ts = getPlayerPaidOffTransactions(appData, gameId, authId);
    return _.sum(_.map(_.filter(ts, t => t.borrower === authId), t => t.oranges.later));
}

export function getLoanPayementsReceived(appData, gameId, authId) {
    const ts = getPlayerPaidOffTransactions(appData, gameId, authId);
    return _.sum(_.map(_.filter(ts, t => t.lender === authId), t => t.oranges.later));
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
    const payments = _.filter(getEventsInGame(appData, gameId, LOAN.PAID_OFF),
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

export function isPlayerDead(appData, gameId, authId) {
    getFitness(appData, gameId, authId) <= 0;
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
        case LOAN.PAID_OFF: return PAID_OFF;
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

export function deriveTransactions(appData, gameId, authId) {
    const openOfferEvents = _.filter(getEventsInGame(appData, gameId, LOAN.OFFER_WINDOW_OPENED),
                                    e => e.authId === authId);
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
