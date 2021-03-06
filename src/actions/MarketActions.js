import _ from 'lodash';
import model from '../model';
import { LOAN } from '../constants/EventTypes';
import { CREATING, OPEN, ACCEPTED, REJECTED,
            PAID_BACK } from '../constants/NegotiationStates';
import { saveEvent, updateFbObject } from '../firebaseUtils';
import { DEFAULT_LOAN_ORANGES } from '../constants/Settings';

export function payDebt(transaction) {
    const eventData = {
        type: LOAN.PAID_BACK,
        lender: transaction.lender,
        borrower: transaction.borrower,
        oranges: transaction.oranges,
        authId: model.authId,
        transactionId: transaction.id,
    };
    saveEvent(model.gameId, eventData);
}

function createNegotation(lender, borrower, type) {
    const eventData = {
        type: type,
        lender: lender,
        borrower: borrower,
        oranges: DEFAULT_LOAN_ORANGES,
        authId: model.authId
    };
    const newRef = saveEvent(model.gameId, eventData);
    const id = newRef.key();
    const data = { transactionId: id };
    updateFbObject(`/games/${model.gameId}/events/${id}`, data);
}

export function openOffer(transaction, nowOranges, laterOranges, type) {
    const eventData = {
        type: type,
        lender: transaction.lender,
        borrower: transaction.borrower,
        oranges: {
            now: nowOranges,
            later: laterOranges
        },
        authId: model.authId,
        transactionId: transaction.id,
    };
    saveEvent(model.gameId, eventData);
}

export function updateOffer(transaction, nowOranges, laterOranges) {
    const eventData = {
        type: LOAN.COUNTER_OFFER,
        lender: transaction.lender,
        borrower: transaction.borrower,
        oranges: {
            now: nowOranges,
            later: laterOranges
        },
        authId: model.authId,
        transactionId: transaction.id,
    };
    saveEvent(model.gameId, eventData);
}

export function rejectOffer(transaction, callback) {
    const eventData = {
        type: LOAN.REJECTED,
        lender: transaction.lender,
        borrower: transaction.borrower,
        authId: model.authId,
        oranges: transaction.oranges,
        transactionId: transaction.id,
    };
    saveEvent(model.gameId, eventData);
}

export function acceptOffer(transaction, callback) {
    const eventData = {
        type: LOAN.ACCEPTED,
        lender: transaction.lender,
        borrower: transaction.borrower,
        authId: model.authId,
        oranges: transaction.oranges,
        transactionId: transaction.id,
    };
    saveEvent(model.gameId, eventData);
}

export function openAskNegotiation(withPlayer, appData) {
    createNegotation(withPlayer, model.authId, LOAN.ASK_WINDOW_OPENED);
}

export function openOfferNegotiation(withPlayer, appData) {
    createNegotation(model.authId, withPlayer, LOAN.OFFER_WINDOW_OPENED);
}
