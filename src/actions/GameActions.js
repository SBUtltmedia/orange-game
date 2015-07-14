import { DROP_ORANGE, NEW_DAY, JOIN_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';
import _ from 'lodash';

export function joinGame(gameId, userId) {
    const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}/users`);
    return dispatch => {
        function sendBackResults(name, userId, playerId) {
            //ref.off();
            dispatch({
                type: JOIN_GAME,
                name: name,
                userId: userId,
                playerId: playerId
            });
        }
        ref.on("value", snapshot => {
            const users = snapshot.val();
            const existingKey = _.findKey(users, p => p.userId === userId);
            if (existingKey) {
                const player = players[existingKey];
                sendBackResults(player.name, player.userId, existingKey);
            }
            else {
                const player = {
                    name: '' + userId,
                    userId: userId,
                    oranges: {
                        box: 0,
                        basket: 0,
                        dish: 0
                    },
                    fitness: 0
                };
                const playerId = ref.push(player).key();
                sendBackResults(player.name, player.userId, playerId);
            }
        });
    };
}

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
