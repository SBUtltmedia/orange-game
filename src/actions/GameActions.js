import { updateFbObject, addToFbList } from '../firebaseUtils';
import _ from 'lodash';
import * as logic from '../logic';
import model from '../model';
import { getThisPlayer, getThisGame, updateThisPlayer, getEventsInThisGame, getThisGameDay } from '../gameUtils';
import { saveEvent } from '../firebaseUtils';
import { ORANGES_DEALT, PLAYER_DONE, DAY_ADVANCE, ORANGE_MOVED } from '../constants/EventTypes';
import { MAX_ORANGES } from '../constants/Settings';

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

export function dropOrange(source, dest, appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: ORANGES_MOVED,
        day: game.day,
        playerId: model.authId,
        src: source,
        dest: dest
    };
    saveEvent(model.gameId, eventData);
}

function shouldDealNewDay(appData) {
    const game = getThisGame(appData);
    if (game) {
        const dealEvents = getEventsInThisGame(appData, ORANGES_DEALT);
        const myDealEvents = _.filter(dealEvents, e => e.playerId === model.authId);
        return _.size(myDealEvents) < getThisGameDay();
    }
}

function shouldAdvanceDay(appData) {
    const game = getThisGame(appData);
    if (game) {
        const day = getThisGameDay();
        const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
        const doneEventsToday = _.filter(doneEvents, e => e.day === day);
        return _.size(doneEventsToday) >= _.size(game.players);
    }
}

function dealNewDay(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: ORANGES_DEALT,
        day: game.day,
        playerId: model.authId,
        oranges: getRandomNumberOfOranges()
    };
    saveEvent(model.gameId, eventData);
}

function advanceDay(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: DAY_ADVANCED,
        day: game.day + 1
    };
    saveEvent(model.gameId, eventData);
}

export function dealNewDayIfNeeded(appData) {
    if (shouldDealNewDay(appData)) {
        dealNewDay(appData);
    }
}

export function advanceDayIfNeeded(appData) {
    if (shouldAdvanceDay(appData)) {
        advanceDay(appData);
    }
}

export function playerReady(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: PLAYER_DONE,
        playerId: model.authId,
        day: game.day
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
