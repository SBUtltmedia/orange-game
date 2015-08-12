import { addToFbList} from '../utils';
import _ from 'lodash';
import model from '../model';

function openNegotation(givingPlayer, receivingPlayer) {

    console.log(givingPlayer, receivingPlayer);

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
