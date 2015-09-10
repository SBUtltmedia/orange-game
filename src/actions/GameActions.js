import { updateFbObject, addToFbList } from '../firebaseUtils';
import _ from 'lodash';
import * as logic from '../logic';
import model from '../model';
import { getThisPlayer, getThisGame, updateThisPlayer, getEventsInThisGame } from '../gameUtils';
import { saveEvent } from '../firebaseUtils';
import { ORANGES_DEALT, PLAYER_DONE } from '../constants/EventTypes';

export function dropOrange(source, dest, appData) {
    const url = `/games/${model.gameId}/players/${model.authId}`;
    const playerData = getThisPlayer(appData);
    updateFbObject(url, logic.dropOrange(source, dest, playerData));
}

function shouldDealNewDay(appData) {
    const game = getThisGame(appData);
    const dealEvents = getEventsInThisGame(appData, ORANGES_DEALT);
    const myDealEvents = _.filter(dealEvents, e => e.playerId === model.authId);
    return _.size(myDealEvents) < game.day;
}

function shouldAdvanceDay(appData) {
    const game = getThisGame(appData);
    const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
    const doneEventsToday = _.filter(doneEvents, e => e.day === game.day);
    return _.size(doneEventsToday) >= _.size(game.players);
}

function dealNewDay(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: ORANGES_DEALT,
        day: game.day,
        playerId: model.authId,
        oranges: logic.getRandomNumberOfOranges()
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
