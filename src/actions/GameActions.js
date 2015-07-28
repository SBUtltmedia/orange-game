import { DROP_ORANGE, NEW_DAY, JOIN_GAME, GAME_LOAD } from '../constants/ActionTypes';
import { getFbRef, getAuth, getFbObject } from '../utils';
import _ from 'lodash';
import model from '../model';

export function dropOrange(source, dest) {
    return {
        type: DROP_ORANGE,
        source: source,
        dest: dest
    };
}

export function newDay(day) {
    return {
        type: NEW_DAY
    };
}

export function gameLoad(gameId) {
    getFbObject(`/games/${gameId}/players/${model.authId}`, gameData => {
        if (gameData) {
            model.setGameData(gameData);    
        }
    });
}
