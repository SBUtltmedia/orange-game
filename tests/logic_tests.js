import * as logic from '../logic';
import { expect } from 'chai';

describe('logic', () => {

    it('cannot advance day if there are oranges in box', () => {
        const env = {
            gameDay: 1,
            playerDay: 1,
            oranges: {
                box: 1
            }
        };
        expect(logic.canAdvanceDay(env)).to.be.false;
    });

    it('cannot advance day if the game day is less than the player day', () => {
        const env = {
            gameDay: 1,
            playerDay: 2,
            oranges: {
                box: 0
            }
        };
        expect(logic.canAdvanceDay(env)).to.be.false;
    });

    it('can advance day if conditions are met', () => {
        const env = {
            gameDay: 1,
            playerDay: 1,
            oranges: {
                box: 0
            }
        };
        expect(logic.canAdvanceDay(env)).to.be.true;
    });

    it('reduces fitness on a new day', () => {

    });
});
