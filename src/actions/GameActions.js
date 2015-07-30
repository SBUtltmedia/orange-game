import { getFbObject, updateFbObject } from '../utils';
import _ from 'lodash';
import model from '../model';

export function dropOrange(source, dest) {
    model.dropOrange(source, dest);
    const url = `/games/${model.gameId}/players/${model.authId}`;
    updateFbObject(url, model.getGameData());
}

export function newDay(day) {
    model.newDay();
    const url = `/games/${model.gameId}/players/${model.authId}`;
    updateFbObject(url, model.getGameData());
}

export function gameLoad(gameId) {
    const url = `/games/${gameId}/players/${model.authId}`;
    getFbObject(url, gameData => {
        if (gameData.oranges) {
            model.setGameData(gameData);
        }
        else {
            updateFbObject(url, model.getGameData());
        }
    });
}
