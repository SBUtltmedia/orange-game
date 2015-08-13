import { addToFbList, updateFbObject } from '../utils';
import _ from 'lodash';
import model from '../model';
import { CREATING, OPEN, ACCEPTED, REJECTED } from '../constants/NegotiationStates';

function createNegotation(givingPlayer, receivingPlayer) {
    const transaction = {
        lender: givingPlayer,
        borrower: receivingPlayer,
        state: CREATING,
        lastToAct: model.authId,
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

function transferOranges(transaction) {
    const orangesToTransfer = transaction.oranges.now;
    const lenderId = transaction.lender.authId;
    const borrowerId = transaction.borrower.authId;
    const lenderUrl = `/games/${model.gameId}/players/${lenderId}/oranges`;
    const borrowerUrl = `/games/${model.gameId}/players/${borrowerId}/oranges`;
    const newLenderOranges = {
        basket: transaction.lender.oranges.basket - orangesToTransfer
    };
    const newBorrowerOranges = {
        box: transaction.borrower.oranges.box + orangesToTransfer
    };
    updateFbObject(lenderUrl, newLenderOranges);
    updateFbObject(borrowerUrl, newBorrowerOranges);
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
    updateFbObject(url, data, () => transferOranges(transaction));
}

export function openAskNegotiation(withPlayer) {
    createNegotation(model.getPlayerData(withPlayer), model.getPlayerData());
}

export function openOfferNegotiation(withPlayer) {
    createNegotation(model.getPlayerData(), model.getPlayerData(withPlayer));
}
