import _ from 'lodash';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from './constants/Settings';
import * as AppActions from './actions/AppActions';

export function range(n) { return Array.apply(0, Array(n)); }
export function forRange(n, f) { return range(n).map((x, i) => f(i)); }

export function objectToArray(object, keyName='id') {
    return _.map(_.keys(object), key => {
        const obj = object[key];
        obj[keyName] = key;
        return obj;
    });
}

export function trimString(s) {  // Strip whitespace
      return (s || '').replace(/^\s+|\s+$/g, '');
}

function setComponentState(component, stateKey, value) {
    const data = {};
    data[stateKey] = value;
    component.setState(data);
}

export function subscribeToFirebaseObject(component, ref, stateKey) {
    ref.on('value', snapshot => {
        const object = snapshot.val();
        setComponentState(component, stateKey, object);
    });
}

export function subscribeToFirebaseList(component, ref, stateKey, objectKey) {
    ref.on('value', snapshot => {
        const items = snapshot.val();
        setComponentState(component, stateKey, objectToArray(items, objectKey));
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

export function getAuth() {
    const ref = getFbRef('/');
    const auth = ref.getAuth();
    ref.off();
    return auth;
}
