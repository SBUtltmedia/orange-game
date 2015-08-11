import { addToFbList} from '../utils';
import _ from 'lodash';
import model from '../model';

function openNegotation(givingPlayerId, receivingPlayerId) {
    const transaction = {
        giver: givingPlayerId,
        receiver: receivingPlayerId,
        open: true,
        completed: false
    };
    addToFbList(`/games/${model.gameId}/transactions`, transaction);
}

export function openAskNegotiation(withPlayer) {
    openNegotation(withPlayer.authId, model.authId);
}

export function openOfferNegotiation(withPlayer) {
    openNegotation(model.authId, withPlayer.authId);
}
