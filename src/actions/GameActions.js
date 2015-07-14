import { DROP_ORANGE, NEW_DAY, JOIN_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import Firebase from 'firebase';
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
