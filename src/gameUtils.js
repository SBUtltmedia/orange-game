import model from './model';

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
