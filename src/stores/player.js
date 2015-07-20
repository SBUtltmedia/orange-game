import { USER_AUTHED } from '../constants/ActionTypes';

const initialState = {
    name: null,
    userId: null
};

export default function player(state=initialState, action) {
    if (!action) {
        return state;
    }
    switch (action.type) {
        case USER_AUTHED:
            return {
                userId: action.userId,
                name: action.name
            };
    }
    return state;
}
