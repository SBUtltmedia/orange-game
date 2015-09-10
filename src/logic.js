import { MAX_FITNESS_GAIN, DAILY_FITNESS_LOSS, DAYS_IN_GAME } from './constants/Settings';
import _ from 'lodash';

export function getAvailableOranges(env) {
    return env.oranges.box + env.oranges.basket;
}

export function getDaysLeft(env) {
    return DAYS_IN_GAME - env.gameDay;
}
