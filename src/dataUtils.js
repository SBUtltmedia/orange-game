import json2csv from 'json2csv';
import { getAllGames } from './gameUtils';
import { FOUND, ATE, SAVED, BORROWED, LENDED, PAID_BACK } from './constants/CsvEventTypes';
import _ from 'lodash';

export function simplifyGameData(game) {
    return _.map(game.events, e => ({
        game: game.id,
        event: e.type,
        time: e.time,
        player: e.authId ? game.players[e.authId].name : undefined
    }));
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
