import json2csv from 'json2csv';
import { getAllGames, getOrangesEatenOnDay, getOrangesSavedOnDay, getEventDay,
            getFitnessChangeOnDay, getFitnessAtEndOfDay, getGame, getThisPlayerLoanBalanceAtEndOfDay } from './gameUtils';
import { GAME_STARTED, ORANGES_FOUND, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';
import { FOUND, EATEN, SAVED, LOANED, PAID_BACK, CHAT } from './constants/CsvEventTypes';
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
                    const eaten = getOrangesEatenOnDay(appData, gameId, e.authId, day);
                    const saved = getOrangesSavedOnDay(appData, gameId, e.authId, day);
                    if (eaten > 0) {
                        const eatenData = {
                            event: EATEN,
                            value: eaten,
                            player: getPlayerName(e.authId),
                            fitnessChange: getFitnessChangeOnDay(appData, gameId, e.authId, day)
                        };
                        doneEvents.push(_.extend(eatenData, baseObj));
                    };
                    if (saved > 0) {
                        const savedData = {
                            event: SAVED,
                            value: saved,
                            player: getPlayerName(e.authId)
                        };
                        doneEvents.push(_.extend(savedData, baseObj));
                    };
                    const endOfDayData = {
                        fitnessChange: getFitnessChangeOnDay(appData, gameId, e.authId, day),
                        fitness: getFitnessAtEndOfDay(appData, gameId, e.authId, day),
                        debt: getThisPlayerLoanBalanceAtEndOfDay(appData, gameId, e.authId, day)
                    };
                    doneEvents.push(_extend(endOfDayData, baseObj));
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
                case CHAT:
                    const chatData = {
                        event: CHAT,
                        value: e.message,
                        player: player.getPlayerName(e.authId)
                    };
                    return _.extend(chatData, baseObj);
            }
        }));
    }
    const events = simplifyEvents(filterEvents(game.events));
    return _.map(events, e => _.extend(e, { game: gameId }));
}

export function getGameCsv(appData, gameId, callback) {
    json2csv({
        data: simplifyGameData(appData, gameId),
        fields: ['day', 'event', 'player', 'toPlayer', 'value', 'value2',
                    'time', 'fitnessChange', 'fitness', 'debt']
    }, callback);
}
