import * as GameUtils from '../src/gameUtils';
import { expect } from 'chai';
import { DAYS_IN_GAME } from '../src/constants/Settings';

describe('gameUtils', () => {

    it('cannot advance day (derived) if there are oranges in box', () => {
        const data = {
            day: 1,
            oranges: {
                box: 1
            }
        };
        expect(GameUtils.canAdvanceDayDerived(data)).to.be.false;
    });

    it('cannot advance day (derived) if the game day is >= days in game ', () => {
        const data = {
            day: DAYS_IN_GAME + 1,
            oranges: {
                box: 1
            }
        };
        expect(GameUtils.canAdvanceDayDerived(data)).to.be.false;
    });

    it('cannot advance day (derived) if all players are not done ', () => {
        const data = {
            day: DAYS_IN_GAME + 1,
            oranges: {
                box: 1
            },
            playersReady: 
        };
        expect(GameUtils.canAdvanceDayDerived(data)).to.be.false;
    });

    it('can advance day (derived) if conditions are met', () => {
        const data = {
            day: 1,
            oranges: {
                box: 0
            }
        };
        expect(GameUtils.canAdvanceDayDerived(data)).to.be.true;
    });

    it('reduces fitness on a new day', () => {

    });
});
