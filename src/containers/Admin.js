import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import LobbyGames from '../components/LobbyGames';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        textAlign: 'center'
    }
});

export default class Admin extends Component {

    render() {
        const { createGame } = this.actions;
        return <div styles={[styles.page]}>
            <button style={styles.button} onClick={createGame}>
                Create new game
            </button>
            <LobbyGames isAdmin={true} />
        </div>;
    }
}
