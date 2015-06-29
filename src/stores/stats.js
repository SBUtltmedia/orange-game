import { NEW_DAY } from '../constants/ActionTypes';

const initialState = {
  day: 1,
  fitness: 10,
  fitnessToday: 0
};

export default function oranges(state=initialState, action) {
    switch (action.type) {
        case NEW_DAY:
            return {
              day: state.day + 1,
              fitness: state.fitness,
              fitnessToday: state.fitnessToday
            }
        default:
            return state;
    }
    return state;
}
