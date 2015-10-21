import { getThisPlayer } from '../gameUtils';
import _ from 'lodash';
import model from '../model';
import { LOAN_ASK_WINDOW_OPENED, LOAN_OFFER_WINDOW_OPENED,
            LOAN_OFFERED, LOAN_ASKED, LOAN_COUNTER_OFFER,
            LOAN_REJECTED, LOAN_ACCEPTED } from '../constants/EventTypes';
import { CREATING, OPEN, ACCEPTED, REJECTED, PAID } from '../constants/NegotiationStates';
import { saveEvent } from '../firebaseUtils';

export function payDebt(transaction) {
    transferOrangesForDebtPayment(transaction);
    const url = `/games/${model.gameId}/transactions/${transaction.id}`;
    updateFbObject(url, { state: PAID });
}

function createNegotation(givingPlayer, receivingPlayer, type) {
    const eventData = {
        type: type,
        lender: givingPlayer,
        borrower: receivingPlayer,
        oranges: {
            now: 1,
            later: 1
        },
        authId: model.authId
    };
    saveEvent(model.gameId, eventData);
}

function update(transaction, nowOranges, laterOranges, extraData) {
    const url = `/games/${model.gameId}/transactions/${transaction.id}`;
    const data = _.extend({
        oranges: {
            now: nowOranges,
            later: laterOranges
        },
        lastToAct: model.authId
    }, extraData || {});
    updateFbObject(url, data);
}

function transferOranges(fromPlayer, toPlayer, amount) {
    const fromUrl = `/games/${model.gameId}/players/${fromPlayer.authId}/oranges`;
    const toUrl = `/games/${model.gameId}/players/${toPlayer.authId}/oranges`;
    updateFbObject(fromUrl, { basket: fromPlayer.oranges.basket - amount });
    updateFbObject(toUrl, { box: toPlayer.oranges.box + amount });
}

function transferOrangesForLoan(trans) {
    transferOranges(trans.lender, trans.borrower, trans.oranges.now);
}

function transferOrangesForDebtPayment(trans) {
    transferOranges(trans.borrower, trans.lender, trans.oranges.later);
}

export function openOffer(transaction, nowOranges, laterOranges) {
    update(transaction, nowOranges, laterOranges, { state: OPEN });
}

export function updateOffer(transaction, nowOranges, laterOranges) {
    update(transaction, nowOranges, laterOranges);
}

export function rejectOffer(transaction, callback) {
    const eventData = {
        type: LOAN_REJECTED,
        lender: transaction.lender,
        borrower: transaction.borrower,
        authId: authId
    };
    saveEvent(model.gameId, eventData);
}

export function acceptOffer(transaction, callback) {
    const eventData = {
        type: LOAN_ACCEPTED,
        lender: transaction.lender,
        borrower: transaction.borrower,
        authId: authId
    };
    saveEvent(model.gameId, eventData);
}

export function openAskNegotiation(withPlayer, appData) {
    createNegotation(withPlayer, getThisPlayer(appData), LOAN_ASK_WINDOW_OPENED);
}

export function openOfferNegotiation(withPlayer, appData) {
    createNegotation(getThisPlayer(appData), withPlayer, LOAN_OFFER_WINDOW_OPENED);
}
