import { USER_AUTHED, JOIN_GAME, LEAVE_GAME } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import _ from 'lodash';

export function loginUser(name) {
    const ref = getFbRef('/');
    return dispatch => {
        ref.authAnonymously((error, authData) => {
            if (authData) {
                const authId = authData.uid;
                const user = { name: name };
                ref.child('users').child(authId).update(user);
                dispatch(_.extend({ type: USER_AUTHED, authId: authId }, user));
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
        name: userName
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
