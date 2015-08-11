import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS, DAYS_IN_GAME } from './constants/Settings';
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
        this.gameDay = 1;
        this.playerDay = 1;
        this.fitness = 0 - DAILY_FITNESS_LOSS;
        this.fitnessChange = 0 - DAILY_FITNESS_LOSS;
        this.gameId = null;
        this.authId = null;
        this.userName = null;
    }

    dropOrange(source, dest) {
        if (source !== dest) {
            if (dest === 'dish') {
                const fitnessBoost = MAX_FITNESS_BOOST - this.oranges.dish;
                this.fitness += fitnessBoost;
                this.fitnessChange += fitnessBoost;
            }
            else if (source === 'dish') {
                const fitnessBoost = this.oranges.dish - MAX_FITNESS_BOOST - 1;
                this.fitness += fitnessBoost;
                this.fitnessChange += fitnessBoost;
            }
            this.oranges[source] -= 1;
            this.oranges[dest] += 1;
        }
    }

    newGameDay() {
        this.gameDay += 1;
    }

    advancePlayerDay() {
        this.playerDay += 1;
        this.oranges.dish = 0;
        this.oranges.box = getRandomNumberOfOranges();
        this.fitness -= DAILY_FITNESS_LOSS;
        this.fitnessChange = 0 - DAILY_FITNESS_LOSS;
    }

    setGameData(data) {
        this.oranges = data.oranges;
        this.playerDay = data.day;
        this.fitness = data.fitness;
        this.fitnessChange = data.fitnessChange;
    }

    getGameData() {
        return {
            oranges: this.oranges,
            day: this.playerDay,
            fitness: this.fitness,
            fitnessChange: this.fitnessChange
        };
    }

    get canAdvanceDay() {
        return this.playerDay <= this.gameDay && this.oranges.box === 0;
    }

    get availableOranges() {
        return this.oranges.box + this.oranges.basket;
    }

    get daysLeft() {
        return DAYS_IN_GAME - this.gameDay;
    }
}

export default new Model();  // singleton
