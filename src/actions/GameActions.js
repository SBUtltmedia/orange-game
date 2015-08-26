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

export function newGameDay(appData) {
    updateFbObject(`/games/${model.gameId}`, { day: logic.newGameDay(appData) });
}

export function dealNewDay(appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);
    updateFbObject(url, logic.dealNewDay(playerData));
}

export function playerReady(appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);
    updateFbObject(url, logic.newPlayerDay(playerData), () => {
        tryToAdvanceDay(appData);
    });
}

export function tryToAdvanceDay(appData) {
    const game = getThisGame(appData);

    console.log(game);  // player.day hasn't been updated in appData

    if (_.every(game.players, p => p.day > game.day)) {
        newGameDay();
    }
}

export function sendChat(text, appData) {
    const playerData = getThisPlayer(appData);
    const msg = {
        name: playerData.name,
        text: text
    };
    addToFbList(`/games/${model.gameId}/chat`, msg);
}
