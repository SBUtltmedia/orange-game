import { MAX_PLAYERS } from '../constants/Settings';
import { getFbRef } from '../utils';

export function createGame() {
    const ref = getFbRef('/games');
    const game = {
        maxPlayers: MAX_PLAYERS
    };
    const gameId = ref.push(game).key();
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
