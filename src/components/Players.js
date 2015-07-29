import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Player from './Player';
import _ from 'lodash';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import model from '../model';

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        overflow: 'scroll'
    }
};

export default class Players extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    componentWillMount() {
        this.firebaseRef = getFbRef(`/games/${model.gameId}/players`);
        subscribeToFirebaseList(this, this.firebaseRef, 'players', 'authId');
    }

    componentWillUnmount() {
        if (this.firebaseRef) {
            this.firebaseRef.off();
        }
    }

    render() {
        const { players } = this.state;
        return <div style={styles.container}>
            { _.map(players, (p, i) => <Player key={i} {...p} />) }
        </div>;
    }
}
