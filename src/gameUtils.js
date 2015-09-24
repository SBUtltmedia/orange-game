import model from './model';
import _ from 'lodash';
import { ACCEPTED } from './constants/NegotiationStates';
import { ORANGE_MOVED, PLAYER_DONE, ORANGES_DEALT } from './constants/EventTypes';
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

function getOrangesDroppedInDishOrBasket(appData, name, gameId, authId) {
    const orangeMovedEvents = getEventsInGame(appData, gameId, ORANGE_MOVED);
    return _.filter(orangeMovedEvents, e => e.dest === name);
}

function getOrangesDroppedInDish(appData, gameId, authId) {
    return getOrangesDroppedInDishOrBasket(appData, 'dish', gameId, authId);
}

function getOrangesDroppedInBasket(appData, gameId, authId) {
    return getOrangesDroppedInDishOrBasket(appData, 'basket', gameId, authId);
}

export function getOrangesInDish(appData, gameId, authId) {
    const orangesDropped = getOrangesDroppedInDish(appData, gameId, authId);
    const gameDay = getGameDay(appData, gameId);
    return _.size(_.filter(orangesDropped, o => getEventDay(o) === gameDay));
}

export function getOrangesInThisDish(appData) {
    return getOrangesInDish(appData, model.gameId, model.authId);
}

export function getOrangesInBasket(appData, gameId, authId) {
    const orangesDropped = getOrangesDroppedInBasket(appData, gameId, authId);
    const gameDay = getGameDay(appData, gameId);
    return _.size(_.filter(orangesDropped, o => getEventDay(o) === gameDay));
}

export function getOrangesInThisBasket(appData) {
    return getOrangesInBasket(appData, model.gameId, model.authId);
}

export function getOrangesInBox(appData, gameId, authId) {
    const orangesDealtEvents = getEventsInGame(appData, gameId, ORANGES_DEALT);
    const myEvents = _.filter(orangesDealtEvents, e => e.playerId === authId);
    return _.sum(myEvents, e => e.oranges);
}

export function getOrangesInThisBox(appData) {
    return getOrangesInBox(appData, model.gameId, model.authId);
}

function countEventsByPlayer(events) {
    return _.map(_.groupBy(events, e => e.authId), _.size);
}

function getEventsBeforeTime(events, time) {
    return _.filter(events, e => e.time < time);
}

export function getGameDay(appData, gameId) {
    const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
    return _.min(countEventsByPlayer(doneEvents));
}

export function getThisGameDay(appData) {
    return getGameDay(appData, model.gameId);
}

export function getEventDay(appData, event) {
    const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
    const doneEventsBeforeEvent = getEventsBeforeTime(doneEvents, event.time);
    return _.min(countEventsByPlayer(doneEventsBeforeEvent));
}

function getFitnessGainForOrangesEatenInSameDay(orangesEaten) {
    var accum = 0;
    for (var i = 0; i < _.size(orangesEaten); i++) {
        accum += MAX_FITNESS_GAIN - i;
    }
    return accum;
}

function getFitnessGainForOrangesEaten(orangesEaten) {
    return _.sum(_.map(_.range(1, DAYS_IN_GAME + 1), i =>
            getFitnessGainForOrangesEatenInSameDay(_.filter(orangesEaten, o =>
                getGameDay(o) === 1))));
}

export function getFitness(appData, gameId, authId) {
    const orangesEaten = getOrangesDroppedInDish(appData, gameId, authId);
    const fitnessGain = getFitnessGainForOrangesEaten(orangesEaten);
    const day = getGameDay(appData, gameId);
    const fitnessLoss = day * DAILY_FITNESS_LOSS;
    return fitnessGain - fitnessLoss;
}

export function getMyFitness(appData) {
    return getFitness(appData, model.gameId, model.authId);
}

export function getFitnessChange(appData, gameId, authId) {
    // TODO: Implement
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

export function canDealNewDay(appData) {
    return canDealNewDayDerived(deriveData(appData));
}

export function derivePlayers(appData) {
    const game = getThisGame(appData);
    if (game) {
        const playerDoneEvents = getEventsInThisGame(appData, PLAYER_DONE);
        return _.map(game.players, p => { return {
            name: p.name,
            ready: _.size(playerDoneEvents) >= getThisGameDay()
        }});
    }
    else {
        return [];
    }
}

export function deriveData(appData) {
    return {
        oranges: {
            box: getOrangesInThisBox(appData),
            basket: getOrangesInThisBasket(appData),
            dish: getOrangesInThisDish(appData)
        },
        day: getThisGameDay(appData),
        players: derivePlayers(appData)
    };
}

export function canPlayerAdvanceDayDerived(derivedData) {
    return derivedData.oranges.box === 0 && derivedData.day < DAYS_IN_GAME;
}

export function canDealNewDayDerived(derivedData) {
    return _.every(derivedData.players, p => p.ready);
}
