import { getFbRef } from '../utils';

const fbRef = getFbRef();

export function listenToFirebase() {
    return dispatch => {
        return fbRef.on('value', snapshot => dispatch(snapshot.val()));
    }
}

export function disconnectFromFirebase() {
    fbRef.off();
}
