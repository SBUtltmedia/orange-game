import model from './model';
import _ from 'lodash';
import { ACCEPTED } from './constants/NegotiationStates';

export function getGame(firebase, id) {
    if (firebase) {
        const { games } = firebase;
        if (games) {
            return games[id];
        }
    }
}

export function getThisGame(firebase) {
    return getGame(firebase, model.gameId);
}

export function getPlayer(firebase, gameId, authId) {
    const game = getGame(firebase, gameId);
    if (game) {
        return game.players[authId];
    }
}

export function getThisPlayer(firebase) {
    const game = getThisGame(firebase);
    if (game) {
        return game.players[model.authId];
    }
}

export function getPlayerTransactions(firebase, authId) {
    const game = getThisGame(firebase);
    if (game) {
        return _.filter(game.transactions, t => {
            return t.state === ACCEPTED &&
                (t.lender.authId === authId || t.borrower.authId === authId);
        });
    }
    return [];
}

export function getThisPlayerTransactions(firebase) {
    return getThisPlayerTransactions(firebase, model.authId);
}

export function getPlayerDebts(firebase, authId) {
    return _.filter(getPlayerTransactions(firebase, authId), t => {
        return t.borrower.authId === authId;
    });
}

export function getThisPlayerDebts(firebase) {
    return getPlayerDebts(firebase, model.authId);
}

export function getPlayerCredits(firebase, authId) {
    return _.filter(getPlayerTransactions(firebase, authId), t => {
        return t.lender.authId === authId;
    });
}

export function getThisPlayerCredits(firebase) {
    return getPlayerCredits(firebase, model.authId);
}
