import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';
import Firebase from 'firebase';
import LobbyGame from './LobbyGame';
import { subscribeToFirebaseList, objectToArray, getFbRef } from '../utils';
import _ from 'lodash';

const styles = {
    container: {
        height: '90%'
    },
};

@connect(state => ({
    userName: state.player.name
}))
export default class LobbyGames extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        userName: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            games: []
        };
    }

    componentWillMount() {
        this.firebaseRef = getFbRef('/games');
        subscribeToFirebaseList(this, this.firebaseRef, 'games');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { games } = this.state;
        return <div styles={[styles.container]}>
            { _.map(games, (g, i) =>
                            <LobbyGame game={g} key={i} {...this.props} />) }
        </div>;
    }
}
