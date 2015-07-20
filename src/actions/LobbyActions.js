import { USER_AUTHED, JOIN_GAME, LEAVE_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';
import _ from 'lodash';

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

export function joinGame(gameId, userId, userName) {

    console.log(userId + " joining game " + gameId);

    const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}/players`);
    return dispatch => {
        function sendBackResults(name, userId, playerId) {
            //ref.off();
            dispatch({
                type: JOIN_GAME,
                id: gameId,
                player: {
                    name: name,
                    userId: userId,
                    playerId: playerId
                }
            });
        }
        ref.on("value", snapshot => {
            const users = snapshot.val();
            const existingKey = _.findKey(users, p => p.userId === userId);
            if (existingKey) {
                const user = users[existingKey];
                sendBackResults(user.name, user.userId, existingKey);
            }
            else {
                const player = {
                    name: userName,
                    userId: userId,
                    oranges: {
                        box: 0,
                        basket: 0,
                        dish: 0
                    },
                    fitness: 0
                };
                const playerId = ref.push(player).key();
                sendBackResults(player.name, player.userId, playerId);
            }
        });
    };
}

export function leaveGame(gameId, userId) {
    const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}/players`);
    ref.on("value", snapshot => {
        const users = snapshot.val();
        const existingKey = _.findKey(users, p => p.userId === userId);
        if (existingKey) {
            const user = users[existingKey];
            ref.child(existingKey).remove();
            return {
                type: LEAVE_GAME,
                id: gameId,
                userId: userId
            }
        }
    });
}
