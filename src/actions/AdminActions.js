import { CREATE_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';

export function createGame() {
    const ref = new Firebase(`${FIREBASE_APP_URL}/games`);
    const game = {
        players: []
    };
    const gameId = ref.push(game).key();

    console.log(gameId);

    ref.off();
    return {
        type: CREATE_GAME
    };
}
