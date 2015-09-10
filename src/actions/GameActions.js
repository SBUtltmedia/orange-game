import { updateFbObject, addToFbList } from '../firebaseUtils';
import _ from 'lodash';
import * as logic from '../logic';
import model from '../model';
import { getThisPlayer, getThisGame, updateThisPlayer } from '../gameUtils';

export function dropOrange(source, dest, appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);
    updateFbObject(url, logic.dropOrange(source, dest, playerData));
}

export function dealNewDay(appData) {
    console.log("DEAL NEW DAY", appData);
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);
    updateFbObject(url, logic.dealNewDay(playerData));
}

export function playerReady(appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const player = getThisPlayer(appData);
    player.day += 1;
    updateFbObject(url, player);
    tryToAdvanceDay(updateThisPlayer(appData, player));
}

export function tryToAdvanceDay(appData) {
    const game = getThisGame(appData);
    if (_.all(game.players, p => p.day > game.day)) {
        updateFbObject(`/games/${model.gameId}`, { day: game.day + 1 });
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
