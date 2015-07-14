import { USER_AUTHED, JOIN_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';

export function loginUser(name) {
    const ref = new Firebase(FIREBASE_APP_URL);
    return dispatch => {
        function sendBackResults(authData) {
            //ref.off();
            dispatch({
                type: USER_AUTHED,
                userId: authData.uid,
                name: name
            });
        }
        const auth = ref.getAuth();
        if (auth) {  // if already authorized
            sendBackResults(auth);
        }
        else {
            ref.authAnonymously((error, authData) => {
                if (authData) {
                    const user = {
                        userId: authData.uid,
                        name: name
                    };
                    ref.child('users').push(user);  // What ID is this key()?
                    sendBackResults(authData);
                }
                else {
                    console.error("Client unauthenticated.");
                }
            });
        }
    };
}

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
