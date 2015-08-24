import { updateFbObject, addToFbList } from '../utils';
import _ from 'lodash';
import * as logic from '../logic';
import model from '../model';
import { getThisPlayer } from '../gameUtils';

export function dropOrange(source, dest, appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);

    console.log(playerData);

    updateFbObject(url, logic.dropOrange(source, dest, playerData));
}

export function newDay(appData) {
    updateFbObject(`/games/${model.gameId}`, { day: logic.newGameDay(appData) });
}

export function playerReady() {
    logic.advancePlayerDay();
    const url = `/games/${model.gameId}/players/${model.authId}`;
    updateFbObject(url, logic.getPlayerData());
    tryToAdvanceDay();
}

export function tryToAdvanceDay() {
    getFbObject(`/games/${model.gameId}/players`, players => {
        if (_.every(players, p => p.day > logic.gameDay)) {
            newDay();
        }
    });
}

export function sendChat(text) {
    const msg = {
        name: logic.userName,
        text: text
    };
    addToFbList(`/games/${model.gameId}/chat`, msg);
}
