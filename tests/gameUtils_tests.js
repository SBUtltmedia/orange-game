require('source-map-support').install();
import requireUncached from 'require-uncached';
import * as GameUtils from '../src/gameUtils';
import { expect } from 'chai';
import model from '../src/model';
import { DAYS_IN_GAME } from '../src/constants/Settings';
import { PLAYER_DONE } from '../src/constants/EventTypes';

describe('gameUtils', () => {

    afterEach(() => {
        model.reset();
    });

    it('cannot advance day (derived) if there are oranges in box', () => {
        const data = {
            day: 1,
            oranges: {
                box: 1
            }
        };
        expect(GameUtils.canPlayerAdvanceDayDerived(data)).to.be.false;
    });

    it('cannot advance day (derived) if the game day is >= days in game', () => {
        const data = {
            day: DAYS_IN_GAME + 1,
            oranges: {
                box: 1
            }
        };
        expect(GameUtils.canPlayerAdvanceDayDerived(data)).to.be.false;
    });

    it('can advance day (derived) if conditions are met', () => {
        const data = {
            day: 1,
            oranges: {
                box: 0
            }
        };
        expect(GameUtils.canPlayerAdvanceDayDerived(data)).to.be.true;
    });

    it('cannot deal new day (derived) if all players are not done', () => {
        const data = {
            players: [
                { ready: false }
            ]
        };
        expect(GameUtils.canDealNewDayDerived(data)).to.be.false;
    });

    it('can deal new day (derived) if all players are done', () => {
        const data = {
            players: [
                { ready: true }
            ]
        };
        expect(GameUtils.canDealNewDayDerived(data)).to.be.true;
    });

    it('can derive game day 1', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: [
                        { type: PLAYER_DONE, authId: 'ABC' }
                    ]
                }
            }
        };
        expect(GameUtils.getGameDay(appData, 'game1')).to.equal(1);
    });

    it('can derive game day 3', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: [
                        { type: PLAYER_DONE, authId: 'ABC' },
                        { type: PLAYER_DONE, authId: 'DEF' },
                        { type: PLAYER_DONE, authId: 'ABC' },
                        { type: PLAYER_DONE, authId: 'DEF' },
                        { type: PLAYER_DONE, authId: 'ABC' }
                    ]
                }
            }
        };
        expect(GameUtils.getGameDay(appData, 'game1')).to.equal(3);
    });

    it('can derive appData', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: [
                        { type: PLAYER_DONE, authId: 'ABC' }
                    ]
                }
            }
        };
        const derived = {
            day: 1,
            oranges: {
                basket: 0,
                dish: 0,
                box: 0
            },
            players: [
                { name: 'Ken', ready: true },
                { name: 'Jen', ready: false }
            ]
        };
        model.gameId = 'game1';
        expect(GameUtils.deriveData(appData)).to.deep.equal(derived);
    });

    it('reduces fitness on a new day', () => {

    });
});
