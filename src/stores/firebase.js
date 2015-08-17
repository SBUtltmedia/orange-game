const initialState = { };

export default function firebase(state=initialState, action) {
    return _.omit(action, 'type');
}
