var utils = require('../src/utils');
var chai = require('chai');
var expect = chai.expect;

describe('utils', function() {
    describe('objectToArray', function() {
        it('should convert an object to an array', function() {
            var obj = { id123: { val: 1 }};
            expect(utils.objectToArray(obj)).to.deep.equal([{ id: 'id123', val: 1 }]);
        });
    });
});
