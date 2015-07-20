import _ from 'lodash';
import { FIREBASE_APP_URL } from './constants/Settings';

export function range(n) { return Array.apply(0, Array(n)); }
export function forRange(n, f) { return range(n).map((x, i) => f(i)); }

export function objectToArray(obj) {
    return _.map(_.keys(obj), key => { return { ...obj[key], id: key }});
}

export function trimString(s) {  // Strip whitespace
      return (s || '').replace(/^\s+|\s+$/g, '');
}

export function subscribeToFirebaseList(component, ref, stateKey) {
    ref.on("value", snapshot => {
        const items = snapshot.val();
        const data = {};
        data[stateKey] = objectToArray(items);
        component.setState(data);
    });

    // Redudant since value does updates too
    /*
    ref.on("child_added", snapshot => {
        const item = snapshot.val();
        const data = {};
        data[stateKey] = component.state[stateKey].concat([item])
        component.setState(data);
    });
    */
}

export function getFbRef(url) {
    return new Firebase(`${FIREBASE_APP_URL}/${url}`);
}
