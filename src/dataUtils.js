import json2csv from 'json2csv';
import { getAllGames, getOrangesEatenOnDay, getOrangesSavedOnDay, getEventDay, getGame } from './gameUtils';
import { GAME_STARTED, ORANGES_FOUND, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';
import { FOUND, ATE, SAVED, LOANED, PAID_BACK } from './constants/CsvEventTypes';
import _ from 'lodash';

export function simplifyGameData(appData, gameId) {
    const game = getGame(appData, gameId);

    function filterEvents(events) {
        const keep = [ ORANGES_FOUND, PLAYER_DONE, LOAN.ACCEPTED, LOAN.PAID_BACK ];
        return _.filter(events, e => _.contains(keep, e.type));
    }

    function getPlayerName(authId) {
        return game.players[authId].name;
    }

    function simplifyEvents(events) {
        return _.flatten(_.map(events, e => {
            const day = getEventDay(appData, gameId, e);
            const baseObj = { day: day, time: e.time };
            switch (e.type) {
                case PLAYER_DONE:
                    const doneEvents = [];
                    const ate = getOrangesEatenOnDay(day);
                    const saved = getOrangesSavedOnDay(day);
                    if (ate > 0) {
                        const ateData = {
                            event: ATE,
                            value: ate,
                            player: getPlayerName(e.authId)
                        };
                        doneEvents.push(_.extend(ateData, baseObj));
                    };
                    if (saved > 0) {
                        const savedData = {
                            event: SAVED,
                            value: saved,
                            player: getPlayerName(e.authId)
                        };
                        doneEvents.push(_.extend(savedData, baseObj));
                    };
                    return doneEvents;
                case LOAN.ACCEPTED:
                    const loanData = {
                        event: LOANED,
                        player: getPlayerName(e.lender),
                        toPlayer: getPlayerName(e.borrower),
                        value: e.oranges.now,
                        value2: e.oranges.later
                    };
                    return _.extend(loanData, baseObj);
                case LOAN.PAID_BACK:
                    const paidData = {
                        event: PAID_BACK,
                        player: getPlayerName(e.borrower),
                        toPlayer: getPlayerName(e.lender),
                        value: e.oranges.later
                    };
                    return _.extend(paidData, baseObj);
                case ORANGES_FOUND:
                    const foundData = {
                        event: FOUND,
                        value: e.oranges,
                        player: getPlayerName(e.authId)
                    };
                    return _.extend(foundData, baseObj);
            }
        }));
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
