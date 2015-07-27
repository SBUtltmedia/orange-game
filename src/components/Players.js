import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Player from './Player';
import _ from 'lodash';
import { subscribeToFirebaseList, getFbRef } from '../utils';

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        overflow: 'scroll'
    }
};

@connect(state => ({
    gameId: state.game.gameId,
    authId: state.user.authId
}))
export default class Players extends Component {
    static propTypes = {
        authId: PropTypes.string.isRequired,
        gameId: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const { gameId } = nextProps;
        if (gameId) {
            this.firebaseRef = getFbRef(`/games/${gameId}/players`);
            subscribeToFirebaseList(this, this.firebaseRef, 'players', 'authId');
        }
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
