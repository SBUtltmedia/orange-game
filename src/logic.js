import { MAX_ORANGES, MAX_FITNESS_BOOST, DAILY_FITNESS_LOSS, DAYS_IN_GAME } from './constants/Settings';
import _ from 'lodash';

function getRandomNumberOfOranges() {
    return Math.floor(Math.random() * MAX_ORANGES);
}

/*
static playerData(player) {
    return _.extend({ day: player.day || player.playerDay,
                      name: player.name || player.userName },
           _.pick(player, ['authId', 'fitness', 'fitnessChange', 'oranges' ]));
}
*/

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
    env.gameDay += 1;
    return env;
}

export function advancePlayerDay(env) {
    env.playerDay += 1;
    env.oranges.dish = 0;
    env.oranges.box = getRandomNumberOfOranges();
    env.fitness -= DAILY_FITNESS_LOSS;
    env.fitnessChange = 0 - DAILY_FITNESS_LOSS;
}

export function canAdvanceDay(env) {
    return env.playerDay <= env.gameDay && env.oranges.box === 0;
}

export function getAvailableOranges(env) {
    return env.oranges.box + env.oranges.basket;
}

export function getDaysLeft(env) {
    return DAYS_IN_GAME - env.gameDay;
}
