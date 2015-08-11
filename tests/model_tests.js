import requireUncached from 'require-uncached';
import { expect } from 'chai';

describe('model', () => {
    var model;

    beforeEach(() => {
        model = requireUncached('../src/model');
    });

    it('cannot advance day if there are oranges in box', () => {
        model.gameDay = 1;
        model.playerDay = 1;
        model.oranges.box = 1;
        expect(model.canAdvanceDay).to.be.false;
    });

    it('cannot advance day if the game day is less than the player day', () => {
        model.gameDay = 1;
        model.playerDay = 2;
        model.oranges.box = 0;
        expect(model.canAdvanceDay).to.be.false;
    });

    it('can advance day if conditions are met', () => {
        model.gameDay = 1;
        model.playerDay = 1;
        model.oranges.box = 0;
        expect(model.canAdvanceDay).to.be.true;
    });

    it('reduces fitness on a new day', () => {

    });

    describe('mechanics', () => {
        it('is a singleton', () => {
            const model1 = require('../src/model');
            const model2 = require('../src/model');
            model1.newDay();
            expect(model2.playerDay).to.equal(2);
        });
    });
});
