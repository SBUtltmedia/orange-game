import { GAME_STARTED } from '../constants/EventTypes';
import { saveEvent, getFbRef } from '../firebaseUtils';
import model from '../model';

export function createGame() {
    const ref = getFbRef('/games');
    const game = {
        timeCreated: new Date().getTime()
    };
    ref.push(game);
}

export function startGame(gameId) {
    const eventData = {
        type: GAME_STARTED
    };
    saveEvent(gameId, eventData);
}

export function deleteGame(gameId) {
    const ref = getFbRef(`/games/${gameId}`);
    ref.remove();
}
