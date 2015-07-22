import { CREATE_GAME, START_GAME, DELETE_GAME } from '../constants/ActionTypes';
import { MAX_PLAYERS } from '../constants/Settings';
import { getFbRef } from '../utils';

export function createGame() {
    const ref = getFbRef('/games');
    const game = {
        maxPlayers: MAX_PLAYERS
    };
    const gameId = ref.push(game).key();
    //ref.off();
    return {
        type: CREATE_GAME,
        ...game,
        id: gameId,
        started: false
    };
}

export function startGame(gameId) {
    const ref = getFbRef(`/games/${gameId}`);
    ref.update({
        started: true
    });
    return {
        type: START_GAME,
        id: gameId
    };
}

export function deleteGame(gameId) {
    const ref = getFbRef(`/games/${gameId}`);
    ref.remove();
    return {
        type: DELETE_GAME,
        id: gameId
    };
}
