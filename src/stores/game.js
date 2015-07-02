import { DROP_ORANGE, NEW_DAY } from '../constants/ActionTypes';
import { MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS } from '../constants/Settings';
const initialState = {
    oranges: {
        box: 0,
        basket: 0,
        dish: 0
    },
    day: 0,
    fitness: 0,
    fitnessChange: 0
};

export default function game(state=initialState, action) {
    switch (action.type) {
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
                    box: action.oranges,
                    dish: 0,
                    basket: state.oranges.basket
                },
                day: state.day + 1,
                fitness: state.fitness - DAILY_FITNESS_LOSS,
                fitnessChange: 0 - DAILY_FITNESS_LOSS
            }
    }
    return state;
}
