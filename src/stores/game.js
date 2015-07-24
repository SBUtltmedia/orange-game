import { DROP_ORANGE, NEW_DAY, GAME_LOAD } from '../constants/ActionTypes';
import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS } from '../constants/Settings';
import _ from 'lodash';

const initialState = {
    oranges: {
        box: getRandomNumberOfOranges(),
        basket: 0,
        dish: 0
    },
    day: 1,
    fitness: 0 - DAILY_FITNESS_LOSS,
    fitnessChange: 0 - DAILY_FITNESS_LOSS,
    gameId: null
};

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

export default function game(state=initialState, action) {
    if (!action) {
        return state;
    }
    switch (action.type) {
        case GAME_LOAD:
            return _.assign(state, _.omit(action, 'type'));
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
            return { ...state };  // force props to update by making new object
        case NEW_DAY:
            return {
                oranges: {
                    box: getRandomNumberOfOranges(),
                    dish: 0,
                    basket: state.oranges.basket
                },
                day: state.day + 1,
                fitness: state.fitness - DAILY_FITNESS_LOSS,
                fitnessChange: 0 - DAILY_FITNESS_LOSS,
                gameId: state.gameId
            }
    }
    return state;
}
