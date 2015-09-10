import { addToFbList, updateFbObject } from '../firebaseUtils';
import { getThisPlayer } from '../gameUtils';
import _ from 'lodash';
import model from '../model';
import { CREATING, OPEN, ACCEPTED, REJECTED, PAID } from '../constants/NegotiationStates';

export function payDebt(transaction) {
    transferOrangesForDebtPayment(transaction);
    const url = `/games/${model.gameId}/transactions/${transaction.id}`;
    updateFbObject(url, { state: PAID });
}

function createNegotation(givingPlayer, receivingPlayer) {
    const transaction = {
        lender: givingPlayer,
        borrower: receivingPlayer,
        state: CREATING,
        createdBy: model.authId,
        oranges: {
            now: 1,
            later: 1
        }
    };
    addToFbList(`/games/${model.gameId}/transactions`, transaction);
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
    const url = `/games/${model.gameId}/transactions/${transaction.id}`;
    const data = { state: REJECTED, lastToAct: model.authId };
    updateFbObject(url, data, callback);
}

export function acceptOffer(transaction, callback) {
    const url = `/games/${model.gameId}/transactions/${transaction.id}`;
    const data = { state: ACCEPTED, lastToAct: model.authId };
    updateFbObject(url, data, () => transferOrangesForLoan(transaction));
}

export function openAskNegotiation(withPlayer, appData) {
    createNegotation(withPlayer, getThisPlayer(appData));
}

export function openOfferNegotiation(withPlayer, appData) {
    createNegotation(getThisPlayer(appData), withPlayer);
}
