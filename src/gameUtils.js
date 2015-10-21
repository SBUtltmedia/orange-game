import model from './model';
import _ from 'lodash';
import { ACCEPTED } from './constants/NegotiationStates';
import { ORANGES_DEALT, ORANGE_MOVED, PLAYER_DONE,
            LOAN_ASK_WINDOW_OPENED, LOAN_OFFER_WINDOW_OPENED,
            LOAN_OFFERED, LOAN_ASKED, LOAN_COUNTER_OFFER,
            LOAN_REJECTED, LOAN_ACCEPTED } from '../src/constants/EventTypes';
import { MAX_FITNESS_GAIN, DAILY_FITNESS_LOSS, DAYS_IN_GAME } from './constants/Settings';

export function getEventsInGame(appData, gameId, eventType=null) {
    const game = getGame(appData, gameId);
    if (game) {
        if (eventType) {
            return _.filter(game.events, e => e.type === eventType);
        }
        else {
            return game.events;
        }
    }
}

export function getEventsInThisGame(appData, eventType) {
    return getEventsInGame(appData, model.gameId, eventType);
}

function getTodayStart(appData, gameId, authId) {
    const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
    const playerDoneEvents = _.filter(doneEvents, e => e.authId === authId);
    return _.isEmpty(playerDoneEvents) ? 0 : _.last(playerDoneEvents).time;
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
           getOrangesDroppedFromBasket(appData, gameId, authId);
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
           getOrangesDroppedFromBox(appData, gameId, authId);
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
    const game = getGame(appData, gameId);
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
    const doneEvents = getEventsInGame(appData, gameId, ORANGES_DEALT);
    return getHighestEventCountByPlayer(appData, doneEvents, gameId);
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
    const fitnessLoss = day * DAILY_FITNESS_LOSS;
    return fitnessGain - fitnessLoss;
}

export function getMyFitness(appData) {
    return getFitness(appData, model.gameId, model.authId);
}

export function getFitnessChange(appData, gameId, authId) {
    const eatEvents = getOrangeDropInDishEvents(appData, gameId, authId, true);
    const fitnessGain = getFitnessGainForEatEvents(appData, eatEvents);
    return fitnessGain - DAILY_FITNESS_LOSS;
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
        return _.extend({ authId: _.findKey(game.players, player) }, player);
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

export function getPlayerTransactions(appData, authId) {
    const game = getThisGame(appData);
    if (game) {
        const transactions = _.filter(game.transactions, t => {
            return t.state === ACCEPTED &&
                (t.lender.authId === authId || t.borrower.authId === authId);
        });
        return _.map(transactions, t => {
            return _.extend({ id: _.findKey(game.transactions, t) }, t);
        });
    }
    return [];
}

export function getThisPlayerTransactions(appData) {
    return getThisPlayerTransactions(appData, model.authId);
}

export function getPlayerDebts(appData, authId) {
    return _.filter(getPlayerTransactions(appData, authId), t => {
        return t.borrower.authId === authId;
    });
}

export function getThisPlayerDebts(appData) {
    return getPlayerDebts(appData, model.authId);
}

export function getPlayerCredits(appData, authId) {
    return _.filter(getPlayerTransactions(appData, authId), t => {
        return t.lender.authId === authId;
    });
}

export function getThisPlayerCredits(appData) {
    return getPlayerCredits(appData, model.authId);
}

export function canPlayerAdvanceDay(appData) {
    return canPlayerAdvanceDayDerived(deriveData(appData));
}

export function shouldDealNewDay(appData) {
    return shouldDealNewDayDerived(deriveData(appData));
}

export function canPlayerAdvanceDayDerived(derivedData) {
    if (!derivedData) {
        return false;
    }
    return derivedData.oranges.box === 0 && derivedData.day < DAYS_IN_GAME;
}

export function shouldDealNewDayDerived(derivedData) {
    if (!derivedData) {
        return false;
    }
    return _.isEmpty(derivedData.dailyOranges) ||
           _.every(derivedData.players, p => p.ready);
}

function derivePlayer(appData, gameId, authId) {
    const game = getGame(appData, gameId);
    const playerDoneEvents = _.filter(doneEvents, e => e.authId === authId);
    const oranges = getOranges(appData, model.gameId, authId);
    const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
    return {
        authId: authId,
        name: game.players[authId].name,
        ready: oranges.box === 0 && _.size(playerDoneEvents) >= getThisGameDay(appData),
        oranges: oranges
    };
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

function getTransactionEvents(appData, gameId, authId, type) {
    return _.filter(getEventsInGame(appData, gameId, type),
                    e => e.borrower === authId || e.lender === authId);
}

function getTransactionAssociatedWithEvent(appData, gameId, event) {
    return {
        lender: derivePlayer(appData, gameId, event.lender),
        borrower: derivePlayer(appData, gameId, event.borrower)
    }
}

function getTransactions(appData, gameId, authId, type) {
    const events = _.filter(getEventsInGame(appData, gameId, type),
                    e => e.borrower === authId || e.lender === authId);
    return _.map(events,
                e => getTransactionAssociatedWithEvent(appData, gameId, e));
}

export function deriveTransactions(appData, gameId, authId) {
    const openOfferEvents = _.filter(getEventsInGame(appData, gameId, LOAN_OFFER_WINDOW_OPENED),
                                    e => e.authId === authId);
    const openAskEvents = _.filter(getEventsInGame(appData, gameId, LOAN_ASK_WINDOW_OPENED),
                                    e => e.authId === authId);
    const offeredEvents = _.filter(getEventsInGame(appData, gameId, LOAN_OFFERED),
                                    e => e.borrower === authId);
    const askedEvents = _.filter(getEventsInGame(appData, gameId, LOAN_ASKED),
                                    e => e.lender === authId);
    return _.map(_.union(openOfferEvents, openAskEvents, offeredEvents, askedEvents),
                e => getTransactionAssociatedWithEvent(appData, gameId, e));
}

function deepDifference(set1, set2) {
    return _.filter(set1, i1 => !_.some(set2, i2 => _.matches(i1, i2)));
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
    return getTransactions(appData, gameId, authId, LOAN_ACCEPTED);
}

export function deriveMyCompletedTransactions(appData) {
    return deriveCompletedTransactions(appData, model.gameId, model.authId);
}

export function deriveClosedTransactions(appData, gameId, authId) {
    return _.union(
        getTransactions(appData, gameId, authId, LOAN_ACCEPTED),
        getTransactions(appData, gameId, authId, LOAN_REJECTED));
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
