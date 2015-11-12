require('source-map-support').install();
import requireUncached from 'require-uncached';
import * as GameUtils from '../src/gameUtils';
import { expect } from 'chai';
import _ from 'lodash';
import model from '../src/model';
import { DAYS_IN_GAME } from '../src/constants/Settings';
import { ORANGES_DEALT, ORANGE_MOVED, PLAYER_DONE, LOAN } from '../src/constants/EventTypes';
import { CREATING, OPEN, ACCEPTED, REJECTED, PAID_OFF } from '../src/constants/NegotiationStates';

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
                    events: {
                        evt1: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 }
                    }
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
                    events: {
                        evt1: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'DEF', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 3 },
                        evt4: { type: ORANGES_DEALT, authId: 'DEF', oranges: 1, time: 4 },
                        evt5: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 5 },
                    }
                }
            }
        };
        expect(GameUtils.getGameDay(appData, 'game1')).to.equal(3);
    });

    it('derives players', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    }
                }
            }
        };
        model.gameId = 'game1';
        model.authId = 'DEF';
        expect(GameUtils.derivePlayers(appData).length).to.equal(2);
    });

    it('derives appData 1', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 }
                    }
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
                    authId: 'ABC',
                    name: 'Ken',
                    ready: false,
                    oranges: {
                        basket: 0,
                        box: 1,
                        dish: 0
                    }
                },
                {
                    authId: 'DEF',
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

    it('derives appData 2', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 0, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 },
                        evt4: { type: PLAYER_DONE, authId: 'ABC', time: 4 }
                    }
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
                    authId: 'ABC',
                    name: 'Ken',
                    ready: true,
                    oranges: {
                        basket: 0,
                        box: 0,
                        dish: 0
                    }
                },
                {
                    authId: 'DEF',
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
                    events: {
                        evt1: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 }
                    }
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
                    events: {
                        evt1: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 },
                        evt2: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'dish', time: 2 },
                        evt3: { type: PLAYER_DONE, authId: 'ABC', time: 3 },
                    }
                }
            }
        };
        model.gameId = 'game1';
        model.authId = 'ABC';
        expect(GameUtils.getOrangesInMyDish(appData)).to.equal(0);
    });

    it('gets oranges in a basket', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' }
                    },
                    events: {
                        evt1: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 1 },
                        evt2: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 2 }
                    }
                }
            }
        };
        expect(GameUtils.getOrangesInBasket(appData, 'game1', 'ABC')).to.equal(1);
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

    it('gets events in game', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 3 }
                    }
                }
            }
        };
        expect(GameUtils.getEventsInGame(appData, 'game1', ORANGE_MOVED).length).to.equal(1);
        expect(GameUtils.getEventsInGame(appData, 'game1', ORANGES_DEALT).length).to.equal(1);
        expect(GameUtils.getEventsInGame(appData, 'game1').length).to.equal(3);
        expect(GameUtils.getEventsInGame(appData, 'game1', LOAN.OFFER_WINDOW_OPENED).length).to.equal(0);
    });

    it('derives transactions 1', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 },
                        evt4: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 },
                        evt5: { type: LOAN.OFFER_WINDOW_OPENED, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 5 }
                    }
                }
            }
        };
        expect(_.size(GameUtils.deriveTransactions(appData, 'game1', 'ABC'))).to.equal(1);
        expect(_.size(GameUtils.deriveTransactions(appData, 'game1', 'DEF'))).to.equal(0);
    });

    it('derives transactions 2', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 },
                        evt4: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 },
                        evt5: { type: LOAN.OFFER_WINDOW_OPENED, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 5 },
                        evt6: { type: LOAN.OFFERED, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 6 }
                    }
                }
            }
        };
        expect(_.size(GameUtils.deriveTransactions(appData, 'game1', 'ABC'))).to.equal(1);
        expect(_.size(GameUtils.deriveTransactions(appData, 'game1', 'DEF'))).to.equal(1);
    });

    it('derives open transactions 1', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 },
                        evt4: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 },
                        evt5: { type: LOAN.OFFER_WINDOW_OPENED, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 5 },
                        evt6: { type: LOAN.OFFERED, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 6 },
                        evt7: { type: LOAN.REJECTED, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'DEF', transactionId: 'ts1', time: 7 }
                    }
                }
            }
        };
        expect(_.size(GameUtils.deriveOpenTransactions(appData, 'game1', 'ABC'))).to.equal(0);
        expect(_.size(GameUtils.deriveOpenTransactions(appData, 'game1', 'DEF'))).to.equal(0);
    });

    it('gets transaction from event', () => {
        const event = {
            type: LOAN.OFFER_WINDOW_OPENED,
            lender: 'ABC',
            borrower: 'DEF',
            authId: 'ABC',
            transactionId: 'ts1',
            time: 5
        };
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 },
                        evt4: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 },
                        evt5: event
                    }
                }
            }
        };
        expect(GameUtils.getTransactionForEvent(appData, 'game1', event)).to.deep.equal({
            lender: 'ABC',
            borrower: 'DEF',
            oranges: { now: 1, later: 1 },
            state: CREATING,
            lastToAct: 'ABC',
            lastEventType: LOAN.OFFER_WINDOW_OPENED,
            lastEventTime: 5,
            id: 'ts1',
            gameId: 'game1'
        });
    });

    it('gets oranges borrowed 1', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 },
                        evt4: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 },
                        evt5: { type: LOAN.OFFER_WINDOW_OPENED, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 5 },
                        evt6: { type: LOAN.OFFERED, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 6 },
                        evt7: { type: LOAN.ACCEPTED, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'DEF', transactionId: 'ts1', time: 7 }
                    }
                }
            }
        };
        expect(GameUtils.getOrangesBorrowed(appData, 'game1', 'DEF')).to.equal(1);
        expect(GameUtils.getPlayerLoanBalance(appData, 'game1', 'ABC')).to.equal(1);
        expect(GameUtils.getPlayerLoanBalance(appData, 'game1', 'DEF')).to.equal(-1);
        expect(_.size(GameUtils.getPlayerOutstandingTransactions(appData, 'game1', 'ABC'))).to.equal(1);
        expect(_.size(GameUtils.getPlayerOutstandingTransactions(appData, 'game1', 'DEF'))).to.equal(1);
        expect(_.size(GameUtils.getPlayerDebts(appData, 'game1', 'ABC'))).to.equal(0);
        expect(_.size(GameUtils.getPlayerDebts(appData, 'game1', 'DEF'))).to.equal(1);
        expect(_.size(GameUtils.getPlayerCredits(appData, 'game1', 'ABC'))).to.equal(1);
        expect(_.size(GameUtils.getPlayerCredits(appData, 'game1', 'DEF'))).to.equal(0);
    });

    it('gets oranges borrowed 2', () => {
        const appData = {
            games: {
                game1: {
                    players: {
                        ABC: { name: 'Ken' },
                        DEF: { name: 'Jen' }
                    },
                    events: {
                        evt1: { type: PLAYER_DONE, authId: 'ABC', time: 1 },
                        evt2: { type: ORANGES_DEALT, authId: 'ABC', oranges: 1, time: 2 },
                        evt3: { type: ORANGES_DEALT, authId: 'DEF', oranges: 3, time: 3 },
                        evt4: { type: ORANGE_MOVED, authId: 'ABC', src: 'box', dest: 'basket', time: 4 },
                        evt5: { type: LOAN.OFFER_WINDOW_OPENED, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 5 },
                        evt6: { type: LOAN.OFFERED, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'ABC', transactionId: 'ts1', time: 6 },
                        evt7: { type: LOAN.ACCEPTED, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'DEF', transactionId: 'ts1', time: 7 },
                        evt8: { type: ORANGE_MOVED, authId: 'DEF', src: 'box', dest: 'basket', time: 8 },
                        evt9: { type: LOAN.PAID_OFF, oranges: { now: 1, later: 1 }, lender: 'ABC', borrower: 'DEF', authId: 'DEF', transactionId: 'ts1', time: 9 }
                    }
                }
            }
        };
        expect(GameUtils.getOrangesBorrowed(appData, 'game1', 'DEF')).to.equal(1);
        expect(GameUtils.getPlayerLoanBalance(appData, 'game1', 'ABC')).to.equal(0);
        expect(GameUtils.getPlayerLoanBalance(appData, 'game1', 'DEF')).to.equal(0);
        expect(GameUtils.deriveTransactions(appData, 'game1', 'DEF')[0].state).to.equal(PAID_OFF);
        expect(_.size(GameUtils.getPlayerOutstandingTransactions(appData, 'game1', 'ABC'))).to.equal(0);
        expect(_.size(GameUtils.getPlayerOutstandingTransactions(appData, 'game1', 'DEF'))).to.equal(0);
        expect(_.size(GameUtils.getPlayerDebts(appData, 'game1', 'ABC'))).to.equal(0);
        expect(_.size(GameUtils.getPlayerDebts(appData, 'game1', 'DEF'))).to.equal(0);
        expect(GameUtils.getOrangesInBasket(appData, 'game1', 'ABC')).to.equal(0);
        expect(GameUtils.getOrangesInBox(appData, 'game1', 'ABC')).to.equal(1);
        expect(GameUtils.getOrangesInBasket(appData, 'game1', 'DEF')).to.equal(0);
        expect(GameUtils.getOrangesInBox(appData, 'game1', 'DEF')).to.equal(3);
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
