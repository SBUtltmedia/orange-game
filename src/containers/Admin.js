import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import LobbyGames from '../components/LobbyGames';
import { createGame } from '../actions/AdminActions';
import { connect } from 'redux/react';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        textAlign: 'center'
    }
});

@connect(state => ({
    firebase: state.firebase
}))
export default class Admin extends Component {

    render() {
        return <div styles={[styles.page]}>
            <p>
                <button style={styles.button} onClick={createGame}>
                    Create new game
                </button>
            </p>
            <LobbyGames isAdmin={true} />
        </div>;
    }
}
