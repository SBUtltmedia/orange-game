import * as logic from '../src/logic';
import { expect } from 'chai';

describe('logic', () => {

    it('cannot advance day if there are oranges in box', () => {
        const player = {
            day: 1,
            oranges: {
                box: 1
            }
        };
        const game = {
            day: 1
        };
        expect(logic.canAdvanceDay(player, game)).to.be.false;
    });

    it('cannot advance day if the game day is less than the player day', () => {
        const player = {
            day: 2,
            oranges: {
                box: 0
            }
        };
        const game = {
            day: 1
        };
        expect(logic.canAdvanceDay(player, game)).to.be.false;
    });

    it('can advance day if conditions are met', () => {
        const player = {
            day: 1,
            oranges: {
                box: 0
            }
        };
        const game = {
            day: 1
        };
        expect(logic.canAdvanceDay(player, game)).to.be.true;
    });

    it('reduces fitness on a new day', () => {

    });
});
