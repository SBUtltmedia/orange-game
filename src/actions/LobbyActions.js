import { USER_AUTHED, JOIN_GAME, LEAVE_GAME, GET_USER_DATA } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import _ from 'lodash';

export function getUserData(authId) {
    return dispatch => {
        const ref = getFbRef('/users');
        ref.once("value", snapshot => {
            const users = snapshot.val();
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
    const ref = getFbRef(`/games/${gameId}/players/${authId}`);
    const player = {
        name: userName,
        authId: authId
    }
    ref.update(player);
}

export function leaveGame(gameId, authId) {
    return dispatch => {
        const ref = getFbRef(`/games/${gameId}/players/${authId}`);
        ref.remove();
        ref.off();
    };
}
