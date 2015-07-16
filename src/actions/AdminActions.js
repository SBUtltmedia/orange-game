import { CREATE_GAME, START_GAME, DELETE_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL, MAX_PLAYERS } from '../constants/Settings';
import Firebase from 'firebase';

export function createGame() {
    const ref = new Firebase(`${FIREBASE_APP_URL}/games`);
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
    const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}`);
    ref.update({
        started: true
    });
    return {
        type: START_GAME,
        id: gameId
    };
}

export function deleteGame(gameId) {
    const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}`);
    ref.remove();
    return {
        type: DELETE_GAME,
        id: gameId
    };
}
