import { addToFbList, updateFbObject } from '../utils';
import _ from 'lodash';
import model from '../model';

function openNegotation(givingPlayer, receivingPlayer) {
    const transaction = {
        lender: givingPlayer,
        borrower: receivingPlayer,
        open: true,
        completed: false
    };
    addToFbList(`/games/${model.gameId}/transactions`, transaction);
}

function getPlayerInfo(player) {
    return _.pick(player, ['authId', 'name']);
}

export function openAskNegotiation(withPlayer) {
    openNegotation(getPlayerInfo(withPlayer), model.playerInfo);
}

export function openOfferNegotiation(withPlayer) {
    openNegotation(model.playerInfo, getPlayerInfo(withPlayer));
}

export function updateNegotiation(transactionId, nowOranges, laterOranges) {

    console.log(transactionId, nowOranges, laterOranges);

    const oranges = {
        now: nowOranges,
        later: laterOranges
    };
    const url = `/games/${model.gameId}/transactions/${transactionId}/oranges`
    updateFbObject(url, oranges);
}
