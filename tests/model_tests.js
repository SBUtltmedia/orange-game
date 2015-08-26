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
            model1.authId = '123';
            expect(model2.authId).to.equal('123');
        });
    });
});
