import { DROP_ORANGE, NEW_DAY, JOIN_GAME, GAME_LOAD } from '../constants/ActionTypes';
import { getFbObject, updateFbObject } from '../utils';
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
    const url = `/games/${gameId}/players/${model.authId}`;
    getFbObject(url, gameData => {
        if (gameData) {
            model.setGameData(gameData);
        }
        else {
            updateFbObject(url, model.getGameData());
        }
    });
}
