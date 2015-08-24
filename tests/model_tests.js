import requireUncached from 'require-uncached';
import { expect } from 'chai';

describe('model', () => {
    var model;

    beforeEach(() => {
        model = requireUncached('../src/model');
    });

    describe('mechanics', () => {
        it('is a singleton', () => {
            const model1 = require('../src/model');
            const model2 = require('../src/model');
            model1.newGameDay();
            expect(model2.gameDay).to.equal(2);
        });
    });
});
