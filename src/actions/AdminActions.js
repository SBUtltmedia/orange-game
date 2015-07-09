import { CREATE_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL, MAX_PLAYERS } from '../constants/Settings';
import Firebase from 'firebase';

export function createGame(maxPlayers=MAX_PLAYERS) {
    const ref = new Firebase(`${FIREBASE_APP_URL}/games`);
    const game = {
        maxPlayers: maxPlayers
    };
    const gameId = ref.push(game).key();
    ref.off();
    return {
        type: CREATE_GAME,
        gameId: gameId
    };
}
