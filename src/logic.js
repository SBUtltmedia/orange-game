import { MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS, DAYS_IN_GAME } from './constants/Settings';
import _ from 'lodash';

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

export function canAdvanceDay(player, game) {
    return player.day <= game.day && player.oranges.box === 0;
}

export function getAvailableOranges(env) {
    return env.oranges.box + env.oranges.basket;
}

export function getDaysLeft(env) {
    return DAYS_IN_GAME - env.gameDay;
}
