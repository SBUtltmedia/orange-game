import { USER_AUTHED, JOIN_GAME } from '../constants/ActionTypes';

const initialState = {

};

export default function player(state=initialState, action) {
    switch (action.type) {
        case USER_AUTHED:
            return {
                userId: action.userId
            };
        case JOIN_GAME:
            console.log("playerID = " + action.playerId);
            return {
                userId: action.userId,
                playerId: action.playerId,
                name: action.name
            };
    }
    return state;
}
