import { getFbObject, updateFbObject, addToFbList } from '../utils';
import _ from 'lodash';
import model from '../model';

export function dropOrange(source, dest) {
    model.dropOrange(source, dest);
    const url = `/games/${model.gameId}/players/${model.authId}`;
    updateFbObject(url, model.getPlayerData());
}

export function newDay() {
    model.newGameDay();
    updateFbObject(`/games/${model.gameId}`, { day: model.gameDay });
}

export function playerReady() {
    model.advancePlayerDay();
    const url = `/games/${model.gameId}/players/${model.authId}`;
    updateFbObject(url, model.getPlayerData());
    tryToAdvanceDay();
}

export function tryToAdvanceDay() {
    getFbObject(`/games/${model.gameId}/players`, players => {
        if (_.every(players, p => p.day > model.gameDay)) {
            newDay();
        }
    });
}

export function sendChat(text) {
    const msg = {
        name: model.userName,
        text: text
    };
    addToFbList(`/games/${model.gameId}/chat`, msg);
}

export function gameLoad(gameId) {
    const url = `/games/${gameId}/players/${model.authId}`;
    getFbObject(url, gameData => {
        if (gameData.oranges) {
            model.setPlayerData(gameData);
        }
        else {
            updateFbObject(url, model.getPlayerData());
        }
    });
}
