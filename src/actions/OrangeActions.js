import { DROP_ORANGE, NEW_DAY, USER_AUTHED } from '../constants/ActionTypes';
import { API_HOST, FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';
import 'whatwg-fetch';

export function loginUser() {
    const ref = new Firebase(FIREBASE_APP_URL);
    const auth = ref.getAuth();
    if (auth) {  // if already authorized
        return {
            type: USER_AUTHED,
            userId: auth.uid
        }
    }
    else {
        ref.authAnonymously((authData) => {
            if (authData) {
                return {
                    type: USER_AUTHED,
                    userId: authData.uid
                }
            }
            else {
              console.error("Client unauthenticated.");
            }
        });
    }
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
