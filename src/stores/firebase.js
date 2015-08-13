const initialState = {
    player: []
};

export default function firebase(state=initialState, action) {
    console.log(action);
    return action;
}
