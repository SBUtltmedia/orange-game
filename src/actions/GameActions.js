import { updateFbObject, addToFbList } from '../firebaseUtils';
import _ from 'lodash';
import model from '../model';
import { getThisPlayer, getThisGame, updateThisPlayer, getEventsInThisGame,
            getThisGameDay, getEventDay, canPlayerAdvanceDay,
            canDealNewDay } from '../gameUtils';
import { saveEvent } from '../firebaseUtils';
import { ORANGES_DEALT, PLAYER_DONE, ORANGE_MOVED } from '../constants/EventTypes';
import { MAX_ORANGES } from '../constants/Settings';

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

export function dropOrange(source, dest, appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: ORANGES_MOVED,
        playerId: model.authId,
        src: source,
        dest: dest
    };
    saveEvent(model.gameId, eventData);
}

function dealNewDay(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: ORANGES_DEALT,
        playerId: model.authId,
        oranges: getRandomNumberOfOranges()
    };
    saveEvent(model.gameId, eventData);
}

export function dealNewDayIfNeeded(appData) {
    if (canDealNewDay(appData)) {

        console.log("DEALING");

        dealNewDay(appData);
    }
}

export function advanceDayIfNeeded(appData) {
    if (canPlayerAdvanceDay(appData)) {

        console.log("ADVANCE!");

        advanceDay(appData);
    }
}

export function playerReady(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: PLAYER_DONE,
        playerId: model.authId
    };
    saveEvent(model.gameId, eventData);
}

export function sendChat(text, appData) {
    const playerData = getThisPlayer(appData);
    const msg = {
        name: playerData.name,
        text: text
    };
    addToFbList(`/games/${model.gameId}/chat`, msg);
}
