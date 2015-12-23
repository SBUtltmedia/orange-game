import json2csv from 'json2csv';
import { getAllGames, getOrangesEatenOnDay, getOrangesSavedOnDay, getEventDay, getFitnessChangeOnDay,
            getFitnessAtEndOfDay, getGame, getThisPlayerLoanBalanceAtEndOfDay, wasPlayerDeadOnDay } from './gameUtils';
import { GAME_STARTED, ORANGES_FOUND, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';
import { FOUND, EATEN, SAVED, LOANED, PAID_BACK, CHAT, END_OF_DAY } from './constants/CsvEventTypes';
import _ from 'lodash';

const CSV_FIELDS = ['day', 'event', 'player', 'toPlayer', 'value', 'value2', 'time', 'fitnessChange', 'fitness', 'debt'];

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
                    const eatenData = {
                        event: EATEN,
                        value: getOrangesEatenOnDay(appData, gameId, e.authId, day),
                        player: getPlayerName(e.authId)
                    };
                    doneEvents.push(_.extend(eatenData, baseObj));
                    const savedData = {
                        event: SAVED,
                        value: getOrangesSavedOnDay(appData, gameId, e.authId, day),
                        player: getPlayerName(e.authId)
                    };
                    doneEvents.push(_.extend(savedData, baseObj));
                    const endOfDayData = {
                        event: END_OF_DAY,
                        player: getPlayerName(e.authId),
                        fitnessChange: getFitnessChangeOnDay(appData, gameId, e.authId, day),
                        fitness: getFitnessAtEndOfDay(appData, gameId, e.authId, day),
                        debt: getThisPlayerLoanBalanceAtEndOfDay(appData, gameId, e.authId, day)
                    };
                    doneEvents.push(_.extend(endOfDayData, baseObj));
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
                    if (!wasPlayerDeadOnDay(appData, gameId, e.authId, day)) {
                        const foundData = {
                            event: FOUND,
                            value: e.oranges,
                            player: getPlayerName(e.authId)
                        };
                        return _.extend(foundData, baseObj);
                    }
                    break;
                case CHAT:
                    const chatData = {
                        event: CHAT,
                        value: e.message,
                        player: getPlayerName(e.authId)
                    };
                    return _.extend(chatData, baseObj);
            }
        }));
    }
    const events = simplifyEvents(filterEvents(game.events));
    return _.map(events, e => _.extend(e, { game: gameId.substring(1) }));
}

export function getGameCsv(appData, gameId, callback) {
    json2csv({
        data: simplifyGameData(appData, gameId),
        fields: CSV_FIELDS
    }, callback);
}

export function getAllGamesCsv(appData, callback) {
    const games = getAllGames(appData);
    json2csv({
        data: _.flatten(_.map(games, g => simplifyGameData(appData, g.id))),
        fields: _.union(['game'], CSV_FIELDS)
    }, callback);
}
