import { USER_AUTHED } from '../constants/ActionTypes';

const initialState = {
    userId: null,
    playerId: null,
    name: null
};

export default function player(state=initialState, action) {
    if (!action) {
        return state;
    }
    switch (action.type) {
        case USER_AUTHED:
            return {
                userId: action.userId,
                playerId: state.playerId,
                name: action.name
            };
    }
    return state;
}
