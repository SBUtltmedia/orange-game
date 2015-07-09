import { JOIN_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';

export function joinGame(gameId) {
    const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}/players`);
    return dispatch => {
        const player = {

        };
        const gameId = ref.push(player).key();
        ref.off();
        dispatch({
            type: JOIN_GAME
        });
    };
}
