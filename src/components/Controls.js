import React, { PropTypes, Component } from 'react';
import { areaTheme, buttonTheme } from '../styles/Themes';
import OrangeBox from './OrangeBox';
import model from '../model';
import * as GameActions from '../actions/GameActions';
import { subscribeToFirebaseObject, getFbRef } from '../utils';

const styles = {
  container: {
    ...areaTheme,
    backgroundColor: '#F7EAC8',
  },
  button: {
    ...buttonTheme,
    margin: 16,
    position: 'relative',
    top: 50
  }
};

export default class Controls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boxOranges: null
        };
    }

    componentWillMount() {
        const { name } = this.props;
        const { gameId, authId } = model;
        const url = `/games/${gameId}/players/${authId}/oranges/box`;
        this.firebaseRef = getFbRef(url);
        subscribeToFirebaseObject(this, this.firebaseRef, 'boxOranges');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    canAdvanceDay() {
        const { boxOranges } = this.state;

        console.log('boxOranges', boxOranges);

        return boxOranges === 0;
    }

    render() {
        return <div style={styles.container}>
            <OrangeBox />
            <button style={styles.button} disabled={!this.canAdvanceDay()}
                                            onClick={GameActions.newDay}>
                Let a new day begin
            </button>
            <button style={styles.button} onClick={() => alert('Not implemented')}>
                Offer/request a loan
            </button>
        </div>;
    }
}
