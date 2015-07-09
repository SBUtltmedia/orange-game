import { CREATE_GAME } from '../constants/ActionTypes';

const initialState = {
    games: []
};

export default function lobby(state=initialState, action) {
    switch (action.type) {
        case CREATE_GAME:
            return [{
                 id: action.id,
                 players: []
               }, ...state];
    }
    return state;
}
