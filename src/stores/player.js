import { USER_AUTHED, JOIN_GAME } from '../constants/ActionTypes';

const initialState = {
    userId: null,
    playerId: null,
    name: null
};

export default function player(state=initialState, action) {
    switch (action.type) {
        case USER_AUTHED:
            return {
                userId: action.userId,
                playerId: state.playerId,
                name: action.name
            };
        case JOIN_GAME:
            return {
                userId: action.userId,
                playerId: action.playerId,
                name: state.name
            };
    }
    return state;
}
