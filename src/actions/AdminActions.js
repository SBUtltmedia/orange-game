import { MAX_PLAYERS } from '../constants/Settings';
import { NOT_STARTED, STARTED, FINISHED } from '../constants/GameStates';
import { getFbRef } from '../utils';

export function createGame() {
    const ref = getFbRef('/games');
    const game = {
        state: NOT_STARTED
    };
    ref.push(game);
}

export function startGame(gameId) {
    const ref = getFbRef(`/games/${gameId}`);
    ref.update({
        state: STARTED
    });
}

export function deleteGame(gameId) {
    const ref = getFbRef(`/games/${gameId}`);
    ref.remove();
}
