import { JOIN_GAME, LEAVE_GAME, CREATE_GAME, START_GAME, DELETE_GAME }
                            from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
    games: []
};

export default function lobby(state=initialState, action) {
    switch (action.type) {
        /*
        case JOIN_GAME:
            const gameToJoin = _.find(state.games, g => g.id === action.id);
            gameToJoin.players = [...gameToJoin.players, action.player]
            return state;
        case LEAVE_GAME:
            const game = _.find(state.games, g => g.id === action.id);
            const userId = action.player.userId;
            game.players = _.remove(game.players, p => p.userId === userId);
            return state;
        case CREATE_GAME:
            return {
                games: [{
                    id: action.id,
                    players: [],
                    maxPlayers: action.maxPlayers
                }, ...state]
           };
       case START_GAME:
            const gameToStart = _.find(state.games, g => g.id === action.id);
            gameToStart.started = true;
            return state;
       case DELETE_GAME:
            return { games: _.remove(state.games, g => g.id === action.id) };
        */
    }
    return state;
}
