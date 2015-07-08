import { USER_AUTHED } from '../constants/ActionTypes';

const initialState = {

};

export default function player(state=initialState, action) {
    switch (action.type) {
        case USER_AUTHED:
            return {
                userId: action.userId
            };
    }
    return state;
}
