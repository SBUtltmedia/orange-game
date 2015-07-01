import 'isomorphic-fetch';
import { FETCH_ORANGES, DROP_ORANGE, NEW_DAY } from '../constants/ActionTypes';
import { API_HOST } from '../constants/Settings';
import 'whatwg-fetch';
// Right now it just fakes everything and doesn't use the API server

export function fetchOranges(day) {
    return dispatch => {
          fetch(`/getOranges?day=${day}`)
          .then(res => res.json())
          .then(res => dispatch({
              type: FETCH_ORANGES,
              oranges: res.oranges
          }));
        }
}

export function dropOrange(source, dest) {
    return {
        type: DROP_ORANGE,
        source: source,
        dest: dest
    };
}

export function newDay() {
    return {
        type: NEW_DAY
    };
}
