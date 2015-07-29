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

    dropOrange(source, dest) {
        this.oranges[source] -= 1;
        this.oranges[dest] += 1;
    }

    newDay() {
        this.day += 1;
        return this.day;
    }

    setGameData(data) {
        this.oranges = data.oranges;
        this.day = data.day;
        this.fitness = data.fitness;
        this.fitnessChange = data.fitnessChange;
    }

    getGameData() {
        return {
            oranges: this.oranges,
            day: this.day,
            fitness: this.fitness,
            fitnessChange: this.fitnessChange
        };
    }

    get canAdvanceDay() {
        return this.oranges.box === 0;
    }
}

export default new Model();  // singleton
