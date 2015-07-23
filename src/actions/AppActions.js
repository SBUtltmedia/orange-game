import { GET_USER_DATA } from '../constants/ActionTypes';
import { getFbRef } from '../utils';
import _ from 'lodash';

export function getUserData(authId) {
    return dispatch => {
        const ref = getFbRef('/users');
        ref.once("value", snapshot => {
            const users = snapshot.val();
            const user = _.find(users, u => u.authId === authId);
            dispatch({
                type: GET_USER_DATA,
                authId: authId,
                name: user.name
            });
        });
    }
}
