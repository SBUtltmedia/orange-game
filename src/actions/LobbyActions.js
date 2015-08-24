import { getFbRef, updateFbObject } from '../utils';
import _ from 'lodash';
import model from '../model';
import * as logic from '../logic';

function hasAlreadyJoinedSomeGame(appData) {
    return _.some(appData.games, game => {
        return _.some(_.keys(game.players), key => key === model.authId);
    });
}

export function checkIfNameTaken(name, callback) {
    getFbObject('/users', users => {
        callback(_.some(users, u => u.name === name));
    });
}

export function setName(authId, name) {
    updateFbObject(`/users/${authId}`, { name: name });
}

export function joinGame(gameId, appData) {
    if (hasAlreadyJoinedSomeGame(appData)) {
        alert("You're already in a game.");
    }
    else {
        const ref = getFbRef(`/games/${gameId}/players/${model.authId}`);
        const player = {
            name: model.userName,
            oranges: {
                box: logic.getRandomNumberOfOranges(),
                basket: 0,
                dish: 0
            },
            fitness: 0,
            fitnessChange: 0,
            day: 1
        };
        ref.update(player);
    }
}

export function leaveGame(gameId) {
    const ref = getFbRef(`/games/${gameId}/players/${model.authId}`);
    ref.remove();
    ref.off();
}
