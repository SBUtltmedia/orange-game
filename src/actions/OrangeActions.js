import 'isomorphic-fetch';
import { FETCH_ORANGES, DROP_ORANGE, NEW_DAY } from '../constants/ActionTypes';
import { API_HOST } from '../constants/Settings';

// Right now it just fakes everything and doesn't use the API server

export function fetchOranges() {
  return dispatch => {
      dispatch({
          type: FETCH_ORANGES,
          oranges: 10
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

export function newDay() {
    return {
        type: NEW_DAY
    };
}
