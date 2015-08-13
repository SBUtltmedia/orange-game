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

function update(transactionId, nowOranges, laterOranges, extraData) {
    const url = `/games/${model.gameId}/transactions/${transactionId}`;
    const data = _.extend({
        oranges: {
            now: nowOranges,
            later: laterOranges
        },
        lastToAct: model.authId
    }, extraData || {});
    updateFbObject(url, data);
}

export function openOffer(transactionId, nowOranges, laterOranges) {
    update(transactionId, nowOranges, laterOranges, { state: OPEN });
}

export function updateOffer(transactionId, nowOranges, laterOranges) {
    update(transactionId, nowOranges, laterOranges);
}

export function rejectOffer(transactionId, callback) {
    const url = `/games/${model.gameId}/transactions/${transactionId}`;
    const data = { state: REJECTED, lastToAct: model.authId };
    updateFbObject(url, data, callback);
}

export function acceptOffer(transactionId, callback) {
    const url = `/games/${model.gameId}/transactions/${transactionId}`;
    const data = { state: ACCEPTED, lastToAct: model.authId };
    updateFbObject(url, data, callback);
}

function getPlayerInfo(player) {
    return _.pick(player, ['authId', 'name']);
}

export function openAskNegotiation(withPlayer) {
    createNegotation(getPlayerInfo(withPlayer), model.playerInfo);
}

export function openOfferNegotiation(withPlayer) {
    createNegotation(model.playerInfo, getPlayerInfo(withPlayer));
}
