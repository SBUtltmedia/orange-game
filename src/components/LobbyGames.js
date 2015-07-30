import React, { PropTypes, Component } from 'react';
import LobbyGame from './LobbyGame';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import _ from 'lodash';

const styles = {
    container: {
        height: '90%'
    },
};

export default class LobbyGames extends Component {
    static propTypes = {
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
        subscribeToFirebaseList(this, this.firebaseRef, 'games', 'gameId');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { games } = this.state;
        const { isAdmin } = this.props;
        return <div styles={[styles.container]}>
            { _.map(games, (g, i) =>
                            <LobbyGame game={g} key={i} isAdmin={isAdmin} />) }
        </div>;
    }
}
