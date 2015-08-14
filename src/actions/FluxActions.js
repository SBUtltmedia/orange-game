import { getFbRef } from '../utils';

export function listenToFirebase() {
    return dispatch => {
        return getFbRef().on('value', snapshot => dispatch(snapshot.val()));
    }
}
