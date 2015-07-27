import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS } from './constants/Settings';
import _ from 'lodash';

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

class Model {
    constructor() {
        this._oranges = {
            box: getRandomNumberOfOranges(),
            basket: 0,
            dish: 0
        };
        this._day = 1;
        this._fitness = 0 - DAILY_FITNESS_LOSS;
        this._fitnessChange = this.fitness;
        this._gameId = null;
    }

    newDay() {
        this._day += 1;
        return this._day;
    }

    set day(day) {
        this._day = day;
    }

    get day() {
        return this._day;
    }
}

export default new Model();  // singleton
