require('source-map-support').install();
import * as Utils from '../src/utils';
import { expect } from 'chai';

describe('utils', () => {
    it('converts empty JSON to empty CSV', () => {
        const json = {};
        expect(Utils.convertJsonToCsv(json)).to.equal('');
    });

    it('converts 1 level JSON to CSV', () => {
        const json = { id: 1 };
        expect(Utils.convertJsonToCsv(json)).to.equal('id\n1');
    });
});
