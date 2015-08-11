import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import OrangeBox from './OrangeBox';
import model from '../model';
import { playerReady }from '../actions/GameActions';
import { subscribeToFirebaseObject, getFbRef } from '../utils';
import { DAYS_IN_GAME } from '../constants/Settings';

const styles = {
  container: {
        ...areaTheme,
        backgroundColor: '#F7EAC8',
    },
    buttons: {
        display: 'flex'
    },
    button: {
        margin: '1%',
        position: 'relative',
        top: 50,
        width: '48%'
    }
};

export default class Controls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerData: null
        };
    }

    componentWillMount() {
        const { name } = this.props;
        const { gameId, authId } = model;
        this.firebaseRef = getFbRef(`/games/${gameId}/players/${authId}`);
        subscribeToFirebaseObject(this, this.firebaseRef, 'gameData');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    canAdvanceDay() {
        if (this.state.playerData && this.state.playerData.oranges) {
            const { oranges, day } = this.state.playerData;
            return oranges.box === 0 && day < DAYS_IN_GAME;
        }
        return false;
    }

    render() {
        const { gameDay } = this.state;
        return <div style={styles.container}>
            <OrangeBox />
            <div style={styles.buttons}>
                <button style={styles.button} onClick={playerReady}
                        disabled={!model.canAdvanceDay}>
                    I'm done for today
                </button>
                <button style={styles.button} onClick={() => alert('Not implemented')}>
                    Ask for loan
                </button>
            </div>
        </div>;
    }
}
