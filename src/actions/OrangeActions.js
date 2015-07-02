import 'isomorphic-fetch';
import { DROP_ORANGE, NEW_DAY } from '../constants/ActionTypes';
import { API_HOST } from '../constants/Settings';
import 'whatwg-fetch';

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
