import { USER_AUTHED, JOIN_GAME, LEAVE_GAME } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import _ from 'lodash';
import model from '../model';

export function loginUser(name) {

    console.log("Logging in " + name);

    const ref = getFbRef('/');
    ref.authAnonymously((error, authData) => {
        if (authData) {
            const authId = authData.uid;
            const user = { name: name };
            ref.child('users').child(authId).update(user);
            model.userName = name;
            model.authId = authId;
        }
        else {
            console.error("Client unauthenticated.");
        }
    });
}

export function joinGame(gameId, authId, userName) {
    const ref = getFbRef(`/games/${gameId}/players/${authId}`);
    const player = { name: userName };
    ref.update(player);
}

export function leaveGame(gameId, authId) {
    const ref = getFbRef(`/games/${gameId}/players/${authId}`);
    ref.remove();
    ref.off();
}
