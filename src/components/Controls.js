import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Box from './Box';
import { playerDone }from '../actions/GameActions';
import { DAYS_IN_GAME } from '../constants/Settings';
import { connect } from 'redux/react';
import { canIFinishDay } from '../gameUtils';

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
        const canFinish = canIFinishDay(firebase);
        return <div style={styles.container}>
            <Box />
            <button style={styles.button} onClick={() => playerDone(firebase)}
                    disabled={!canFinish}
                    title={canFinish ? null : 'Must use all oranges for the day'}>
                I am done for today
            </button>
        </div>;
    }
}
