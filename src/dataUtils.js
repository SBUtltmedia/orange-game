import json2csv from 'json2csv';
import { getAllGames, getOrangesAteOnDay, getOrangesSavedOnDay, getEventDay } from './gameUtils';
import { GAME_STARTED, ORANGES_FOUND, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';
import { FOUND, ATE, SAVED, BORROWED, LENDED, PAID_BACK } from './constants/CsvEventTypes';
import _ from 'lodash';

function getOtherPlayerInLoan(event) {
    if (event.lender === event.authId) {
        return event.borrower;
    }
    else if (event.borrower === event.authId) {
        return event.lender;
    }
}

export function simplifyGameData(appData, game) {
    function filterEvents(events) {
        const keep = [ ORANGES_FOUND, PLAYER_DONE, LOAN.ACCEPTED, LOAN.PAID_BACK ];
        return _.filter(events, e => _.contains(keep, e.type));
    }

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
            const day = getEventDay(game, e); 
            const obj = { time: e.time, player: getEventPlayer(e) };
            switch (e.type) {
                case PLAYER_DONE:
                    const ate = getOrangesAteOnDay(day);
                    const saved = getOrangesSavedOnDay(day);
                    const ateEvent = _.extend({ type: ATE, value: ate }, obj);
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
