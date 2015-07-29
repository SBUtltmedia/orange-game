import requireUncached from 'require-uncached';
import { expect } from 'chai';

describe('model', () => {
    var model;

    beforeEach(() => {
        model = requireUncached('../src/model');
    });

    it('reduces fitness on a new day', () => {
        
    });

    describe('mechanics', () => {
        it('is a singleton', () => {
            const model1 = require('../src/model');
            const model2 = require('../src/model');
            model1.newDay();
            expect(model2.day).to.equal(2);
        });
    });
});
