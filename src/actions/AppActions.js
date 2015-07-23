import { GET_USER_DATA } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import _ from 'lodash';

export function getUserData(authId) {
    return dispatch => {
        const ref = getFbRef(`/users/${authId}`);
        ref.once("value", snapshot => {
            const user = snapshot.val();
            if (user) {
                dispatch({
                    type: GET_USER_DATA,
                    name: user.name,
                    authId: authId
                });
            }
        });
    }
}
