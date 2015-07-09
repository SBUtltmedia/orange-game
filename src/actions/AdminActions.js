import { CREATE_GAME } from '../constants/ActionTypes';
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
        gameId, gameId
    };
}
