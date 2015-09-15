import { updateFbObject, addToFbList } from '../firebaseUtils';
import _ from 'lodash';
import * as logic from '../logic';
import model from '../model';
import { getThisPlayer, getThisGame, updateThisPlayer, getEventsInThisGame,
            getThisGameDay, getEventDay } from '../gameUtils';
import { saveEvent } from '../firebaseUtils';
import { ORANGES_DEALT, PLAYER_DONE, DAY_ADVANCED, ORANGE_MOVED }
            from '../constants/EventTypes';
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

function shouldDealNewDay(appData) {
    const game = getThisGame(appData);
    if (game) {
        const dealEvents = getEventsInThisGame(appData, ORANGES_DEALT);
        const myEvents = _.filter(dealEvents, e => e.playerId === model.authId);
        return _.size(myEvents) < getThisGameDay();
    }
}

function shouldAdvanceDay(appData) {
    const game = getThisGame(appData);
    if (game) {
        const gameDay = getThisGameDay();
        if (gameDay === 0) {
            return true;
        }
        const doneEvents = getEventsInThisGame(appData, PLAYER_DONE);
        const doneEventsToday = _.filter(doneEvents, e => {
            const eventDay = getEventDay(appData, e);
            return eventDay === gameDay;
        });
        return _.size(doneEventsToday) >= _.size(game.players);
    }
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

function advanceDay(appData) {
    const game = getThisGame(appData);
    const eventData = {
        type: DAY_ADVANCED
    };

    console.log(eventData);

    saveEvent(model.gameId, eventData);
}

export function dealNewDayIfNeeded(appData) {
    if (shouldDealNewDay(appData)) {

        console.log("DREALING");

        dealNewDay(appData);
    }
}

export function advanceDayIfNeeded(appData) {
    if (shouldAdvanceDay(appData)) {

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
