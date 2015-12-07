require('source-map-support').install();
import * as DataUtils from '../src/dataUtils';
import { expect } from 'chai';
import _ from 'lodash';
import { GAME_STARTED, ORANGES_DEALT, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';

describe('dataUtils', () => {

    it('flattens game data', () => {
        const game = {
            id: 'game1',
            timeCreated: 123456789,
            players: {
                'ABC': { name: 'Ken' },
                'DEF': { name: 'Thom' },
            },
            events: {
                'ev1': { type: GAME_STARTED, time: 1 },
                'ev2': { type: ORANGES_DEALT, authId: 'ABC', oranges: 8, time: 2 },
                'ev3': { type: ORANGES_DEALT, authId: 'DEF', oranges: 0, time: 3 },
                'ev4': { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 }
            }
        };
        const expected = [
            { game: 'game1', event: GAME_STARTED, player: undefined, time: 1 },
            { game: 'game1', event: ORANGES_DEALT, player: 'Ken', value: 8, time: 2 },
            { game: 'game1', event: ORANGES_DEALT, player: 'Thom', value: 0, time: 3 },
            { game: 'game1', event: ORANGE_MOVED, player: 'Ken', value: '???', time: 4 },
        ];
        expect(DataUtils.flattenGame(game)).to.deep.equal(expected);
    });
});
