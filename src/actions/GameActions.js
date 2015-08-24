import { updateFbObject, addToFbList } from '../utils';
import _ from 'lodash';
import * as logic from '../logic';
import model from '../model';
import { getThisPlayer, getThisGame } from '../gameUtils';

export function dropOrange(source, dest, appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);
    updateFbObject(url, logic.dropOrange(source, dest, playerData));
}

export function newDay(appData) {
    updateFbObject(`/games/${model.gameId}`, { day: logic.newGameDay(appData) });
}

export function playerReady(appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);
    updateFbObject(url, logic.advancePlayerDay(playerData));
    tryToAdvanceDay(appData);
}

export function tryToAdvanceDay(appData) {
    const game = getThisGame(appData);
    if (_.every(game.players, p => p.day > game.day)) {
        newDay();
    }
}

export function sendChat(text) {
    const msg = {
        name: logic.userName,
        text: text
    };
    addToFbList(`/games/${model.gameId}/chat`, msg);
}
