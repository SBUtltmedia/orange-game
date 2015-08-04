import { MAX_PLAYERS, GAME_STATES } from '../constants/Settings';
import { getFbRef } from '../utils';

const { NOT_STARTED, STARTED, FINISHED } = GAME_STATES;

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
