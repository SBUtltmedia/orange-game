import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS } from './constants/Settings';
import _ from 'lodash';

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

class Model {
    constructor() {
        this.oranges = {
            box: getRandomNumberOfOranges(),
            basket: 0,
            dish: 0
        };
        this.day = 1;
        this.fitness = 0 - DAILY_FITNESS_LOSS;
        this.fitnessChange = this.fitness;
        this.gameId = null;
        this.authId = null;
        this.userName = null;
    }

    newDay() {
        this.day += 1;
        return this.day;
    }
}

export default new Model();  // singleton
