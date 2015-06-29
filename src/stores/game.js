import { FETCH_ORANGES, DROP_IN_DISH, DROP_IN_BASKET, NEW_DAY }
        from '../constants/ActionTypes';

function getRandomNumberOfOranges() {
    return Math.round(Math.random() * 11);
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
        case DROP_IN_DISH:
            const fitnessBoost = 10 - state.oranges.dish;
            return {
                oranges: {
                    box: state.oranges.box - 1,
                    dish: state.oranges.dish + 1,
                    basket: state.oranges.basket
                },
                day: state.day,
                fitness: state.fitness + fitnessBoost,
                fitnessChange: state.fitnessChange + fitnessBoost
            }
        case DROP_IN_BASKET:
            return {
                oranges: {
                    box: state.oranges.box - 1,
                    dish: state.oranges.dish,
                    basket: state.oranges.basket + 1
                },
                day: state.day,
                fitness: state.fitness,
                fitnessChange: state.fitnessChange
            }
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
