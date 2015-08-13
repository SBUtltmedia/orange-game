export function listenToFirebase() {
    return dispatch => {
        dispatch({
            players: [ { name: 'Ken' } ]
        })
    };
}
