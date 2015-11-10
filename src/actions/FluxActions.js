import { getFbRef } from '../firebaseUtils';
const fbRef = getFbRef();

// TODO: Listen to single game or lobby stubs

export function listenToFirebase() {
    return dispatch => {
        return fbRef.on('value', snapshot => dispatch(snapshot.val()));
    }
}

export function disconnectFromFirebase() {
    fbRef.off();
}
