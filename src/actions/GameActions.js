import _ from 'lodash';
import model from '../model';
import { getThisPlayer, getThisGame, updateThisPlayer, getEventsInThisGame,
            getThisGameDay, shouldDealNewDay } from '../gameUtils';
import { saveEvent } from '../firebaseUtils';
import { ORANGES_FOUND, PLAYER_DONE, ORANGE_MOVED,
            CHAT } from '../constants/EventTypes';
import { MAX_ORANGES } from '../constants/Settings';

function getRandomNumberOfOranges() {
    return Math.ceil(Math.random() * MAX_ORANGES);
}

export function dropOrange(source, dest, appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: ORANGE_MOVED,
        authId: model.authId,
        src: source,
        dest: dest
    };
    saveEvent(model.gameId, eventData);
}

function dealNewDay(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: ORANGES_FOUND,
        authId: model.authId,
        oranges: getRandomNumberOfOranges()
    };
    saveEvent(model.gameId, eventData);
}

export function dealNewDayIfNeeded(appData) {
    if (shouldDealNewDay(appData)) {
        dealNewDay(appData);
    }
}

export function playerDone(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: PLAYER_DONE,
        authId: model.authId
    };
    saveEvent(model.gameId, eventData);
}

export function sendChat(text, appData) {
    const player = getThisPlayer(appData);
    const eventData = {
        type: CHAT,
        name: player.name,
        text: text
    };
    saveEvent(model.gameId, eventData);
}
