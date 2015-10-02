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

function getOrangesDroppedIn(appData, name, gameId, authId) {
    const orangeMovedEvents = getEventsInGame(appData, gameId, ORANGE_MOVED);
    return _.filter(orangeMovedEvents, e => e.dest === name);
}

function getOrangesDroppedFrom(appData, name, gameId, authId) {
    const orangeMovedEvents = getEventsInGame(appData, gameId, ORANGE_MOVED);
    return _.filter(orangeMovedEvents, e => e.src === name);
}

function getOrangesDroppedInDish(appData, gameId, authId) {
    return getOrangesDroppedIn(appData, 'dish', gameId, authId);
}

function getOrangesDroppedInBasket(appData, gameId, authId) {
    return getOrangesDroppedIn(appData, 'basket', gameId, authId);
}

function getOrangesDroppedInBox(appData, gameId, authId) {
    return getOrangesDroppedIn(appData, 'box', gameId, authId);
}

function getOrangesDroppedFromDish(appData, gameId, authId) {
    return getOrangesDroppedFrom(appData, 'dish', gameId, authId);
}

function getOrangesDroppedFromBasket(appData, gameId, authId) {
    return getOrangesDroppedFrom(appData, 'basket', gameId, authId);
}

function getOrangesDroppedFromBox(appData, gameId, authId) {
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

export function getGameDay(appData, gameId) {
    const doneEvents = getEventsInGame(appData, gameId, PLAYER_DONE);
    return getLowestEventCountByPlayer(appData, doneEvents, gameId) + 1;
}

export function getThisGameDay(appData) {
    return getGameDay(appData, model.gameId);
}

export function getEventDay(appData, event) {
    const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
    const prevDoneEvents = getEventsBeforeTime(doneEvents, event.time);
    return getLowestEventCountByPlayer(appData, prevDoneEvents, model.gameId) + 1;
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

export function shouldDealNewDay(appData) {
    return shouldDealNewDayDerived(deriveData(appData));
}

export function canPlayerAdvanceDayDerived(derivedData) {
    return derivedData.oranges.box === 0 && derivedData.day < DAYS_IN_GAME;
}

export function shouldDealNewDayDerived(derivedData) {
    return _.isEmpty(derivedData.dailyOranges) ||
           _.every(derivedData.players, p => p.ready);
}

export function derivePlayers(appData) {
    const game = getThisGame(appData);
    if (game) {
        const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
        return _.map(game.players, p => {
            const authId = _.findKey(game.players, p);
            const playerDoneEvents = _.filter(doneEvents, e => e.authId === authId);
            const oranges = getOranges(appData, model.gameId, authId);
            return {
                name: p.name,
                ready: oranges.box === 0 && _.size(playerDoneEvents) >= getThisGameDay(),
                oranges: oranges
            };
        });
    }
    else {
        return [];
    }
}

export function deriveData(appData) {
    return {
        dailyOranges: getMyDailyOranges(appData),
        oranges: getMyOranges(appData),
        day: getThisGameDay(appData),
        players: derivePlayers(appData)
    };
}
