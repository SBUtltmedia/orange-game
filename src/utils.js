import _ from 'lodash';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from './constants/Settings';

export function trimString(s) {  // Strip whitespace
      return (s || '').replace(/^\s+|\s+$/g, '');
}

export function getFbObject(path, callback=() => {}) {
    getFbRef(path).once('value', snapshot => callback(snapshot.val()));
}

export function updateFbObject(path, data, callback=() => {}) {
    getFbRef(path).update(data, callback);
}

export function addToFbList(path, data, callback=function() {}) {
    getFbRef(path).push(data, callback);
}

export function getFbRef(url) {
    return new Firebase(`${FIREBASE_APP_URL}/${url || ''}`);
}

export function getAuth() {
    const ref = getFbRef('/');
    const auth = ref.getAuth();
    ref.off();
    return auth;
}
