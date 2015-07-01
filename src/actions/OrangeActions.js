import 'isomorphic-fetch';
import { FETCH_ORANGES, BOX_TO_BASKET, BOX_TO_DISH, BASKET_TO_DISH, NEW_DAY } from '../constants/ActionTypes';
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

export function boxToBasket() {
    return {
        type: BOX_TO_BASKET
    };
}

export function boxToDish() {
    return {
        type: BOX_TO_DISH
    };
}

export function basketToDish() {
    return {
        type: BASKET_TO_DISH
    };
}

export function newDay() {
    return {
        type: NEW_DAY
    };
}
