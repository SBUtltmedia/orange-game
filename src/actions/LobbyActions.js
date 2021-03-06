import { getFbRef, updateFbObject } from '../firebaseUtils';
import { getThisUser, getAllGames, getAllUsers, isGameFinished } from '../gameUtils';
import _ from 'lodash';
import model from '../model';

function hasAlreadyJoinedSomeGame(appData) {
    const games = getAllGames(appData);
    return _.some(games, game => {
        return !isGameFinished(appData, game.id) &&
                _.some(_.keys(game.players), key => key === model.authId);
    });
}

export function checkIfNameTaken(name, appData) {
    const users = getAllUsers(appData);
    return _.some(users, u => u.name === name);
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
        const user = getThisUser(appData);
        ref.update({ name: user.name });
    }
}

export function leaveGame(gameId) {
    const ref = getFbRef(`/games/${gameId}/players/${model.authId}`);
    ref.remove();
    ref.off();
}
