require('source-map-support').install();
import * as Utils from '../src/utils';
import { expect } from 'chai';

describe('utils', () => {
    it('converts JSON to CSV', () => {
        const json = {};
        const csv = Utils.convertJsonToCsv(json);
        expect(csv).to.equal('');
    });
});
