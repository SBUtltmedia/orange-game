import { DROP_ORANGE, NEW_DAY, USER_AUTHED, JOIN_GAME } from '../constants/ActionTypes';
import { API_HOST, FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';
import _ from 'lodash';
import 'whatwg-fetch';

export function loginUser() {
    return dispatch => {
        const ref = new Firebase(FIREBASE_APP_URL);
        const auth = ref.getAuth();
        if (auth) {  // if already authorized
            dispatch({
                type: USER_AUTHED,
                userId: auth.uid
            });
        }
        else {
            ref.authAnonymously((authData) => {
                if (authData) {
                    dispatch({
                        type: USER_AUTHED,
                        userId: authData.uid
                    });
                }
                else {
                  console.error("Client unauthenticated.");
                }
            });
        }
    };
}

export function joinGame(userId) {
    const ref = new Firebase(`${FIREBASE_APP_URL}/players`);
    return dispatch => {
        ref.on("value", function(snapshot) {
            const players = snapshot.val();
            const existingKey = _.findKey(players, p => p.userId === userId);
            if (existingKey) {
                const existingPlayer = players[existingKey];
                dispatch({
                    type: JOIN_GAME,
                    name: existingPlayer.name,
                    userId: existingPlayer.userId,
                    playerId: existingKey
                });
            }
            else {
                const player = {
                    name: '' + userId,
                    userId: userId
                };
                const playerId = ref.push(player).key();
                dispatch({
                    type: JOIN_GAME,
                    name: player.name,
                    userId: player.userId,
                    playerId: playerId
                });
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
    return dispatch => {
      fetch(`/oranges?day=${day}`)
      .then(res => res.json())
      .then(res => dispatch({
          type: NEW_DAY,
          oranges: res.oranges
      }));
    }
}
