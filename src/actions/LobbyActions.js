import { USER_AUTHED, JOIN_GAME, LEAVE_GAME } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import _ from 'lodash';
import model from '../model';

export function setName(authId, name) {
    const ref = getFbRef(`/users/${authId}`);
    const user = { name: name };
    ref.update(user);
    model.userName = name;
}

export function joinGame(gameId) {
    const ref = getFbRef(`/games/${gameId}/players/${model.authId}`);
    const player = { name: model.userName };
    ref.update(player);
}

export function leaveGame(gameId) {
    const ref = getFbRef(`/games/${gameId}/players/${model.authId}`);
    ref.remove();
    ref.off();
}
