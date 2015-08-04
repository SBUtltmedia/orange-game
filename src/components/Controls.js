import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import OrangeBox from './OrangeBox';
import Market from './Market';
import model from '../model';
import * as GameActions from '../actions/GameActions';
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
        margin: 16,
        position: 'relative',
        top: 50
    }
};

export default class Controls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameData: null
        };
    }

    componentWillMount() {
        const { name } = this.props;
        const { gameId, authId } = model;
        const url = `/games/${gameId}/players/${authId}`;
        this.firebaseRef = getFbRef(url);
        subscribeToFirebaseObject(this, this.firebaseRef, 'gameData');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    canAdvanceDay() {
        if (this.state.gameData && this.state.gameData.oranges) {
            const { oranges, day } = this.state.gameData;
            return oranges.box === 0 && day < DAYS_IN_GAME;
        }
        return false;
    }

    render() {
        return <div style={styles.container}>
            <OrangeBox />
            <div style={styles.buttons}>
                <button style={styles.button} disabled={!this.canAdvanceDay()}
                                                onClick={GameActions.newDay}>
                    Let a new day begin
                </button>
                <Market buttonStyle={styles.button} />
            </div>
        </div>;
    }
}
