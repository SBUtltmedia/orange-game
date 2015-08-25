import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS, DAYS_IN_GAME } from './constants/Settings';
import _ from 'lodash';

export function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

export function getInitialState(player) {
    return {
        name: player.name,
        oranges: {
            box: logic.getRandomNumberOfOranges(),
            basket: 0,
            dish: 0
        },
        fitness: 0 - DAILY_FITNESS_LOSS,
        fitnessChange: 0 - DAILY_FITNESS_LOSS,
        day: 1
    };
}

export function dropOrange(source, dest, env) {
    if (source !== dest) {
        if (dest === 'dish') {
            const fitnessBoost = MAX_FITNESS_BOOST - env.oranges.dish;
            env.fitness += fitnessBoost;
            env.fitnessChange += fitnessBoost;
        }
        else if (source === 'dish') {
            const fitnessBoost = env.oranges.dish - MAX_FITNESS_BOOST - 1;
            env.fitness += fitnessBoost;
            env.fitnessChange += fitnessBoost;
        }
        env.oranges[source] -= 1;
        env.oranges[dest] += 1;
    }
    return env;
}

export function newGameDay(env) {
    env.day += 1;
    return env;
}

export function newPlayerDay(env) {
    env.day += 1;
    return env;
}

export function dealNewDay(env) {
    env.oranges.dish = 0;
    env.oranges.box = getRandomNumberOfOranges();
    env.fitness -= DAILY_FITNESS_LOSS;
    env.fitnessChange = 0 - DAILY_FITNESS_LOSS;
    return env;
}

export function canAdvanceDay(player, game) {
    return player.day <= game.day && player.oranges.box === 0;
}

export function getAvailableOranges(env) {
    return env.oranges.box + env.oranges.basket;
}

export function getDaysLeft(env) {
    return DAYS_IN_GAME - env.gameDay;
}
