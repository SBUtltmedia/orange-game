import { FETCH_ORANGES, DROP_ORANGE, NEW_DAY }
        from '../constants/ActionTypes';

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * 11);
}

const initialState = {
    oranges: {
        box: getRandomNumberOfOranges(),
        basket: 0,
        dish: 0
    },
    day: 1,
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
                const fitnessBoost = 10 - state.oranges.dish;
                state.fitness += fitnessBoost;
                state.fitnessChange += fitnessBoost;
            }
            else if (source === 'dish') {
                const fitnessBoost = state.oranges.dish - 11;
                state.fitness += fitnessBoost;
                state.fitnessChange += fitnessBoost;
            }
            state.oranges[source] -= 1;
            state.oranges[dest] += 1;
            return state;
        case NEW_DAY:
            return {
                oranges: {
                    box: getRandomNumberOfOranges(),
                    dish: 0,
                    basket: state.oranges.basket
                },
                day: state.day + 1,
                fitness: state.fitness - 10,
                fitnessChange: -10
            }
        case FETCH_ORANGES:
            return action.oranges;
    }
    return state;
}
