import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import OrangeBox from './OrangeBox';
import * as logic from '../logic';
import { playerReady }from '../actions/GameActions';
import { DAYS_IN_GAME } from '../constants/Settings';
import { connect } from 'redux/react';
import { getThisPlayer, getThisGame } from '../gameUtils';

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

    render() {
        const { firebase } = this.props;
        const player = getThisPlayer(firebase);
        const game = getThisGame(firebase);

        if (player && game) {
            return <div style={styles.container}>
                <OrangeBox />
                <button style={styles.button} onClick={() => playerReady(firebase)}
                        disabled={!logic.canAdvanceDay(player, game)}>
                    I am done for today
                </button>
            </div>;
        }
        else {
            return <div style={styles.container}></div>;
        }
    }
}
