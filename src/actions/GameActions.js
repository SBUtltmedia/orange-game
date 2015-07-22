import { DROP_ORANGE, NEW_DAY, JOIN_GAME, GAME_LOAD } from '../constants/ActionTypes';
import { getFbRef, getAuth } from '../utils';
import _ from 'lodash';

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
    return dispatch => {
        const auth = getAuth();
        if (auth) {
            const ref = getFbRef(`/games/${gameId}/players`);
            ref.once('value', snapshot => {
                const players = snapshot.val();
                const game = _.find(players, p => p.authId === auth.uid);
                dispatch({
                    type: GAME_LOAD,
                    ...game,
                    gameId: gameId
                });
            });
        }
    }
}
