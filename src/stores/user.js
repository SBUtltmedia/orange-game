import { USER_AUTHED, GET_USER_DATA } from '../constants/ActionTypes';

const initialState = {
    name: null,
    authId: null
};

export default function player(state=initialState, action) {
    if (!action) {
        return state;
    }
    switch (action.type) {
        case USER_AUTHED:

            console.log("AUTHED", action);

            return {
                name: action.name,
                authId: action.authId
            };
        case GET_USER_DATA:
            return {
                name: action.name
            };
    }
    return state;
}
