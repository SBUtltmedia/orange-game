import { CREATE_GAME, START_GAME, DELETE_GAME } from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
    games: []
};

export default function lobby(state=initialState, action) {
    switch (action.type) {
        case CREATE_GAME:
            return [{
                 id: action.id,
                 players: action.players,
                 maxPlayers: action.maxPlayers
               }, ...state];
       case START_GAME:
            _.find(state.games, g => g.id === action.id).started = true;
            return state;
       case DELETE_GAME:
            return { games: _.remove(state.games, g => g.id === action.id) };
    }
    return state;
}
