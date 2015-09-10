import model from './model';
import _ from 'lodash';
import { ACCEPTED } from './constants/NegotiationStates';

export function getEventsInGame(appData, gameId, eventType=null) {
    const game = getGame(gameId);
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
    return getEventsInGame(appData, eventType, model.gameId);
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
