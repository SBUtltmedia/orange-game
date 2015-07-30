import { MAX_PLAYERS } from '../constants/Settings';
import { getFbRef } from '../utils';

export function createGame() {
    const ref = getFbRef('/games');
    const game = {
        started: false
    };
    ref.push(game);
}

export function startGame(gameId) {
    const ref = getFbRef(`/games/${gameId}`);
    ref.update({
        started: true
    });
}

export function deleteGame(gameId) {
    const ref = getFbRef(`/games/${gameId}`);
    ref.remove();
}
