import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS } from './constants/Settings';
import _ from 'lodash';

const data = {
    oranges: {
        box: getRandomNumberOfOranges(),
        basket: 0,
        dish: 0
    },
    day: 1,
    fitness: 0 - DAILY_FITNESS_LOSS,
    fitnessChange: 0 - DAILY_FITNESS_LOSS,
    gameId: null
}

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

export function newDay() {
    data.day += 1;
    return getDay();
}

export function getDay() {
    return data.day;
}
