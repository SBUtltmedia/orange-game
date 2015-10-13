require('source-map-support').install();
import requireUncached from 'require-uncached';
import * as GameUtils from '../src/gameUtils';
import { expect } from 'chai';
import model from '../src/model';
import { DAYS_IN_GAME } from '../src/constants/Settings';
import { ORANGES_DEALT, ORANGE_MOVED, PLAYER_DONE } from '../src/constants/EventTypes';

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
            dailyOranges: [ 1 ],
            players: [
                { ready: false }
            ]
        };
        expect(GameUtils.shouldDealNewDayDerived(data)).to.be.false;
    });

    it('can deal new day (derived) if all players are done', () => {
        const data = {
            dailyOranges: [ 1 ],
            players: [
                { ready: true }
            ]
        };
        expect(GameUtils.shouldDealNewDayDerived(data)).to.be.true;
    });

    it('can deals new day (derived) if all player has never gotten oranges', () => {
        const data = {
            dailyOranges: [],
            players: [
                { ready: false }
            ]
        };
        expect(GameUtils.shouldDealNewDayDerived(data)).to.be.true;
    });

    it('does not deal day if appData is null', () => {
        expect(GameUtils.shouldDealNewDayDerived(null)).to.be.false;
    });

    it('derives game day 1', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: [
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 },
                    ]
                }
            }
        };
        expect(GameUtils.getGameDay(appData, 'game1')).to.equal(1);
    });

    it('derives game day 3', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: [
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 },
                        { type: ORANGES_DEALT, authId: 'DEF', oranges: 1, time: 2 },
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 3 },
                        { type: ORANGES_DEALT, authId: 'DEF', oranges: 1, time: 4 },
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 5 },
                    ]
                }
            }
        };
        expect(GameUtils.getGameDay(appData, 'game1')).to.equal(3);
    });

    it('derives appData', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: [
                        { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 }
                    ]
                }
            }
        };
        const derived = {
            day: 1,
            dailyOranges: [ 3 ],
            oranges: {
                basket: 0,
                dish: 0,
                box: 3
            },
            players: [
                {
                    name: 'Ken',
                    ready: false,
                    oranges: {
                        basket: 0,
                        box: 1,
                        dish: 0
                    }
                },
                {
                    name: 'Jen',
                    ready: false,
                    oranges: {
                        basket: 0,
                        box: 3,
                        dish: 0
                    }
                }
            ]
        };
        model.gameId = 'game1';
        model.authId = 'DEF';
        expect(GameUtils.deriveData(appData)).to.deep.equal(derived);
    });

    it('gets oranges in my box', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' }
                    },
                    events: [
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 }
                    ]
                }
            }
        };
        model.gameId = 'game1';
        model.authId = 'ABC';
        expect(GameUtils.getOrangesInMyBox(appData)).to.equal(1);
    });

    it('gets oranges in my dish', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' }
                    },
                    events: [
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 },
                        { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'dish', time: 2 },
                        { type: PLAYER_DONE, authId: 'ABC', time: 3 }
                    ]
                }
            }
        };
        model.gameId = 'game1';
        model.authId = 'ABC';
        expect(GameUtils.getOrangesInMyDish(appData)).to.equal(0);
    });

    it('gets oranges dropped', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' }
                    },
                    events: [
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 }
                    ]
                }
            }
        };
        model.gameId = 'game1';
        model.authId = 'ABC';
        expect(GameUtils.getOrangesDroppedInBox(appData, 'game1', 'ABC')).to.equal(0);
        expect(GameUtils.getOrangesDroppedInBasket(appData, 'game1', 'ABC')).to.equal(0);
        appData.games.game1.events.push({
            type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 2
        });
        expect(GameUtils.getOrangesDroppedInBox(appData, 'game1', 'ABC')).to.equal(0);
        expect(GameUtils.getOrangesDroppedInBasket(appData, 'game1', 'ABC')).to.equal(1);
        expect(GameUtils.getOrangesDroppedFromBox(appData, 'game1', 'ABC')).to.equal(1);
    });

    it('reduces fitness on a new day', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' }
                    },
                    events: []
                }
            }
        };
        model.gameId = 'game1';
        model.authId = 'ABC';
        expect(GameUtils.getMyFitness(appData)).to.equal(0);
        appData.games.game1.events.push({
            type: ORANGES_DEALT, authId: 'ABC', oranges: 8, time: 1
        });
        expect(GameUtils.getMyFitness(appData)).to.equal(-10);
        expect(GameUtils.getMyFitnessChange(appData)).to.equal(-10);
    });

    it('increases fitness when orange is eaten', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' }
                    },
                    events: [
                        { type: ORANGES_DEALT, authId: 'ABC', oranges: 8, time: 1 }
                    ]
                }
            }
        };
        model.gameId = 'game1';
        model.authId = 'ABC';
        expect(GameUtils.getMyFitness(appData)).to.equal(-10);
        appData.games.game1.events.push({
            type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'dish', time: 2
        });
        expect(GameUtils.getMyFitness(appData)).to.equal(0);
        expect(GameUtils.getMyFitnessChange(appData)).to.equal(0);
        appData.games.game1.events.push({
            type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'dish', time: 3
        });
        expect(GameUtils.getMyFitness(appData)).to.equal(9);
        expect(GameUtils.getMyFitnessChange(appData)).to.equal(9);
    });
});
