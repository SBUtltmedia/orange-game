import { objectToArray } from '../src/utils';
import { expect } from 'chai';

describe('utils', () => {
    describe('objectToArray', () => {
        it('converts an object to an array', () => {
            const obj = { id123: { val: 1 }};
            const expected = [{ id: 'id123', val: 1 }];
            expect(objectToArray(obj)).to.deep.equal(expected);
        });

        it('converts an object to an array using custom objectKey', () => {
            const obj = { id123: { val: 1 }};
            const expected = [{ id1: 'id123', val: 1 }];
            expect(objectToArray(obj, 'id1')).to.deep.equal(expected);
        });
    });
});
