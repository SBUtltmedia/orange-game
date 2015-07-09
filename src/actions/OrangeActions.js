import { DROP_ORANGE, NEW_DAY, USER_AUTHED, JOIN_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';
import _ from 'lodash';

export function loginUser() {
    return dispatch => {
        function sendBackResults(authData) {
            dispatch({
                type: USER_AUTHED,
                userId: authData.uid
            });
        }
        const ref = new Firebase(FIREBASE_APP_URL);
        const auth = ref.getAuth();
        if (auth) {  // if already authorized
            sendBackResults(auth);
        }
        else {
            ref.authAnonymously((error, authData) => {
                if (authData) {
                    sendBackResults(authData);
                }
                else {
                    console.error("Client unauthenticated.");
                }
            });
        }
    };
}

export function joinGame(userId) {
    const ref = new Firebase(`${FIREBASE_APP_URL}/players`);
    return dispatch => {
        function sendBackResults(name, userId, playerId) {
            dispatch({
                type: JOIN_GAME,
                name: name,
                userId: userId,
                playerId: playerId
            });
        }
        ref.on("value", function(snapshot) {
            const players = snapshot.val();
            const existingKey = _.findKey(players, p => p.userId === userId);
            if (existingKey) {
                const player = players[existingKey];
                sendBackResults(player.name, player.userId, existingKey);
            }
            else {
                const player = {
                    name: '' + userId,
                    userId: userId
                };
                const playerId = ref.push(player).key();
                sendBackResults(player.name, player.userId, playerId);
            }
        });
    };
}

export function dropOrange(source, dest) {
    return {
        type: DROP_ORANGE,
        source: source,
        dest: dest
    };
}

export function newDay(day) {
    return {
        type: NEW_DAY
    };
}
