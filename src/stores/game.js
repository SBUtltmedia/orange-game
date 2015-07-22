import { DROP_ORANGE, NEW_DAY, GAME_LOAD } from '../constants/ActionTypes';
import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS } from '../constants/Settings';
const initialState = {
    oranges: {
        box: 0,
        basket: 0,
        dish: 0
    },
    day: 0,
    fitness: 0,
    fitnessChange: 0,
    id: null,
    playerId: null
};

export default function game(state=initialState, action) {
    if (!action) {
        return state;
    }
    switch (action.type) {
        case GAME_LOAD:
            state.id = action.gameId;
            return state;
        case DROP_ORANGE:
            const source = action.source.toLowerCase();
            const dest = action.dest.toLowerCase();
            if (source === dest) {
                return state;
            }
            if (dest === 'dish') {
                const fitnessBoost = MAX_FITNESS_BOOST - state.oranges.dish;
                state.fitness += fitnessBoost;
                state.fitnessChange += fitnessBoost;
            }
            else if (source === 'dish') {
                const fitnessBoost = state.oranges.dish - MAX_FITNESS_BOOST - 1;
                state.fitness += fitnessBoost;
                state.fitnessChange += fitnessBoost;
            }
            state.oranges[source] -= 1;
            state.oranges[dest] += 1;
            return state;
        case NEW_DAY:
            return {
                oranges: {
                    box: Math.floor(Math.random() * MAX_ORANGES),
                    dish: 0,
                    basket: state.oranges.basket
                },
                day: state.day + 1,
                fitness: state.fitness - DAILY_FITNESS_LOSS,
                fitnessChange: 0 - DAILY_FITNESS_LOSS,
                id: state.id,
                playerId: state.authId
            }
    }
    return state;
}
