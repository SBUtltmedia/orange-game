require('source-map-support').install();
import * as DataUtils from '../src/dataUtils';
import { expect } from 'chai';
import _ from 'lodash';
import { GAME_STARTED, ORANGES_FOUND, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';
import { FOUND, EATEN, SAVED, LOANED, PAID_BACK, END_OF_DAY } from '../src/constants/CsvEventTypes';
import { STARTING_FITNESS, MAX_FITNESS_GAIN } from '../src/constants/Settings';

describe('dataUtils', () => {

    it('simplifies game data', () => {
        const appData = {
            games: {
                game1: {
                    timeCreated: 0,
                    players: {
                        'ABC': { name: 'Ken' },
                        'DEF': { name: 'Thom' },
                    },
                    events: {
                        'ev1': { type: GAME_STARTED, time: 1 },
                        'ev2': { type: ORANGES_FOUND, authId: 'ABC', oranges: 8, time: 2 },
                        'ev3': { type: ORANGES_FOUND, authId: 'DEF', oranges: 0, time: 3 },
                        'ev4': { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 },
                        'ev5': { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'dish', time: 5 },
                        'ev6': { type: PLAYER_DONE, authId: 'ABC', time: 6 },
                        'ev7': { type: PLAYER_DONE, authId: 'DEF', time: 7 },
                    }
                }
            }
        };
        const expected = [
            { game: 'game1', event: FOUND, player: 'Ken', value: 8, time: 2, day: 1 },
            { game: 'game1', event: FOUND, player: 'Thom', value: 0, time: 3, day: 1 },
            { game: 'game1', event: EATEN, player: 'Ken', value: 1, time: 6, day: 1 },
            { game: 'game1', event: SAVED, player: 'Ken', value: 1, time: 6, day: 1 },
            { game: "game1", event: END_OF_DAY, player: 'Ken', debt: 0, fitness: STARTING_FITNESS + MAX_FITNESS_GAIN,
                        fitnessChange: MAX_FITNESS_GAIN, time: 6, day: 1 },
            { game: "game1", event: END_OF_DAY, player: 'Thom', debt: 0, fitness: STARTING_FITNESS,
                        fitnessChange: 0, time: 7, day: 1 }
        ];
        expect(DataUtils.simplifyGameData(appData, 'game1')).to.deep.equal(expected);
    });
});
