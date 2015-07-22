import { USER_AUTHED, JOIN_GAME, LEAVE_GAME, GET_USER_DATA } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import Firebase from 'firebase';
import _ from 'lodash';

export function getUserData(authId) {
    return dispatch => {
        const ref = getFbRef('/users');
        ref.once("value", snapshot => {
            const users = snapshot.val();

            console.log(users);
            console.log(authId);

            const user = _.find(users, u => u.authId === authId);
            dispatch({
                type: GET_USER_DATA,
                authId: authId,
                name: user.name
            });
        });
    }
}

export function loginUser(name) {
    const ref = getFbRef('/');
    return dispatch => {
        ref.authAnonymously((error, authData) => {
            if (authData) {
                const user = {
                    authId: authData.uid,
                    name: name
                };
                ref.child('users').push(user);  // What ID is this key()?
                dispatch({
                    type: USER_AUTHED,
                    authId: authData.uid,
                    name: name
                });
            }
            else {
                console.error("Client unauthenticated.");
            }
        });
    };
}

export function joinGame(gameId, authId, userName) {
    const ref = getFbRef(`/games/${gameId}/players`);
    return dispatch => {
        function sendBackResults(name, authId) {
            ref.off();  // Otherwise it holds a reference to the object
                        //and we can't remove it later
            dispatch({
                type: JOIN_GAME,
                id: gameId,
                player: {
                    name: name,
                    authId: authId
                }
            });
        }
        ref.once("value", snapshot => {
            const players = snapshot.val();
            const existingKey = _.findKey(players, p => p.authId === authId);
            if (existingKey) {
                const player = players[existingKey];
                sendBackResults(player.name, player.authId, existingKey);
            }
            else {
                const newPlayer = {
                    name: userName,
                    authId: authId,
                    oranges: {
                        box: 0,
                        basket: 0,
                        dish: 0
                    },
                    fitness: 0
                };
                ref.push(newPlayer);
                sendBackResults(newPlayer.name, newPlayer.authId);
            }
        });
    };
}

export function leaveGame(gameId, authId) {
    return dispatch => {
        const ref = getFbRef(`/games/${gameId}/players`);
        ref.once("value", snapshot => {
            const players = snapshot.val();
            const existingKey = _.findKey(players, p => p.authId === authId);
            if (existingKey) {
                const user = players[existingKey];
                ref.child(existingKey).remove();
                dispatch({
                    type: LEAVE_GAME,
                    id: gameId,
                    authId: authId
                });
            }
        });
        ref.off();
    };
}
