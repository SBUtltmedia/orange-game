import { USER_AUTHED, JOIN_GAME, LEAVE_GAME } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import Firebase from 'firebase';
import _ from 'lodash';

export function loginUser(name) {
    const ref = getFbRef('/');
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

    const ref = getFbRef(`/games/${gameId}/players`);
    return dispatch => {
        function sendBackResults(name, userId) {

            ref.off();  // Otherwise it holds a reference to the object
                        //and we can't remove it later
            dispatch({
                type: JOIN_GAME,
                id: gameId,
                player: {
                    name: name,
                    userId: userId
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
                ref.push(player);
                sendBackResults(player.name, player.userId);
            }
        });
    };
}

export function leaveGame(gameId, userId) {
    return dispatch => {
        const ref = getFbRef(`/games/${gameId}/players`);
        function onValue(snapshot) {

            console.log('onValue');

            ref.off('value', onValue);  // stop future updates
            const users = snapshot.val();
            const existingKey = _.findKey(users, p => p.userId === userId);

            console.log('key', existingKey);

            if (existingKey) {
                const user = users[existingKey];
                ref.child(existingKey).remove();
                dispatch({
                    type: LEAVE_GAME,
                    id: gameId,
                    userId: userId
                });
            }
        }
        ref.on("value", onValue);
    };
}
