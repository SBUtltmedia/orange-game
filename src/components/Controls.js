import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import OrangeBox from './OrangeBox';
import model from '../model';
import { playerReady }from '../actions/GameActions';
import { DAYS_IN_GAME } from '../constants/Settings';
import { connect } from 'redux/react';

const styles = {
  container: {
        ...areaTheme,
        backgroundColor: '#F7EAC8',
    },
    button: {
        margin: '1%',
        position: 'relative',
        top: 50,
        width: '48%'
    }
};

@connect(state => ({
    firebase: state.firebase
}))
export default class Controls extends Component {

    canAdvanceDay() {
        const { gameId, authId } = model;
        const { firebase } = this.props;
        const { games } = firebase;
        if (games) {
            const game = games[gameId];
            const player = game.players[authId];
            if (player.oranges) {
                const { oranges, day } = player;
                return oranges.box === 0 && day < DAYS_IN_GAME;
            }
        }
        return false;
    }

    render() {
        return <div style={styles.container}>
            <OrangeBox />
            <button style={styles.button} onClick={playerReady}
                    disabled={!this.canAdvanceDay()}>
                I'm done for today
            </button>
        </div>;
    }
}
