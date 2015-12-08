import json2csv from 'json2csv';
import { getAllGames, getOrangesAteOnDay, getOrangesSavedOnDay } from './gameUtils';
import { GAME_STARTED, ORANGES_FOUND, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';
import { FOUND, ATE, SAVED, BORROWED, LENDED, PAID_BACK } from './constants/CsvEventTypes';
import _ from 'lodash';

function getEventValues(event) {
    switch (event.type) {
        case ORANGES_FOUND: return event.oranges,
        case PLAYER_DONE: return
        default: return []
    }
}

function getOtherPlayerInLoan(event) {
    if (event.lender === event.authId) {
        return event.borrower;
    }
    else if (event.borrower === event.authId) {
        return event.lender;
    }
}

function filterEvents(events) {
    const keep = [ ORANGES_FOUND, PLAYER_DONE, LOAN.ACCEPTED, LOAN.PAID_BACK ];
    return _.filter(events, e => _.contains(keep, e.type));
}



export function simplifyGameData(game) {
    function getEventPlayer(event) {
        if (event.type === GAME_STARTED) {
            return undefined;
        }
        else {
            return e.authId ? game.players[e.authId].name : undefined;
        }
    }

    function toSimplifiedEvent(e) {
        return {
            event: e.type,
            time: e.time,
            player: e.authId ? game.players[e.authId].name : undefined,
            withPlayer: e.type === LOAN.ACCEPTED ? getOtherPlayerInLoan(e) : undefined
        }
    }

    function simplifyEvents(events) {
        return _.map(events, e => {
            const day = getEventDay(appData, e);  // TODO: Need appData
            switch (e.type) {
                const doneObj = { time: e.time, player: getEventPlayer(e) };
                case PLAYER_DONE:
                    const ate = getOrangesAteOnDay(day);
                    const saved = getOrangesSavedOnDay(day);
                    const ateEvent = _.extend({ type: ATE, value: ate }, doneObj);
                    return [

                    ];
            }
        });
    }
    const events = simplifyEvents(filterEvents(game.events));
    return _.map(events, e => _.extend(e, { game: gameId }));
}

export function getAllGamesCsv(appData, callback) {
    const games = getAllGames(appData);
    console.log(games);
    json2csv({
        data: [{ game_id: 1, player: undefined, event: 'love' }],
        fields: ['game_id', 'player', 'event']
    }, callback);
}

export function getGameCsv(appData, gameId) {

}
