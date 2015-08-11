import _ from 'lodash';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from './constants/Settings';

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

export function getFbObject(path, callback) {
    getFbRef(path).once('value', snapshot => callback(snapshot.val()));
}

export function updateFbObject(path, data) {
    getFbRef(path).update(data);
}

export function addToFbList(path, data) {
    getFbRef(path).push(data);
}

export function subscribeToFirebaseObject(component, ref, stateKey, callback=function() {}) {
    ref.on('value', snapshot => {
        if (snapshot.exists()) {
            const object = snapshot.val();
            setComponentState(component, stateKey, object);
            callback(object);
        }
    });
}

export function subscribeToFirebaseList(component, ref, stateKey, objectKey=null, callback=function() {}) {
    ref.on('value', snapshot => {
        const items = snapshot.val();
        setComponentState(component, stateKey, objectToArray(items, objectKey));
        callback(items);
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
