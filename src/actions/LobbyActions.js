import { getFbRef, getFbObject } from '../utils';
import _ from 'lodash';
import model from '../model';

function hasAlreadyJoinedSomeGame(callback) {
    getFbObject('/games', games => {
        const b = _.some(games, game => {
            return _.some(_.keys(game.players), key => key === model.authId);
        });
        callback(b);
    });
}

export function isNameTaken(name, callback) {
    getFbObject('/users', users => {
        callback(_.some(users, u => u.name === name));
    });
}

export function setName(authId, name) {
    const ref = getFbRef(`/users/${authId}`);
    const user = { name: name };
    ref.update(user);
    model.userName = name;
}

export function joinGame(gameId) {
    if (hasAlreadyJoinedSomeGame(yes => {
        if (yes) {
            alert("You're already in a game.");
        }
        else {
            const ref = getFbRef(`/games/${gameId}/players/${model.authId}`);
            const player = { name: model.userName };
            ref.update(player);
        }
    }));
}

export function leaveGame(gameId) {
    const ref = getFbRef(`/games/${gameId}/players/${model.authId}`);
    ref.remove();
    ref.off();
}
