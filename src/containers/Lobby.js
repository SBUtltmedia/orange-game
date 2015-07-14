import React, { Component } from 'react';
import StyleSheet from'react-style';
import Firebase from 'firebase';
import * as LobbyActions from '../actions/LobbyActions';
import LobbyGame from '../components/LobbyGame';
import { FIREBASE_APP_URL } from '../constants/Settings';
import { subscribeToFirebaseList, objectToArray } from '../utils';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { connect } from 'redux/react';

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

@connect(state => ({
    games: state.lobby.games
}))
export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: []
        };
    }

    componentWillMount() {
        const { dispatch, games } = this.props;
        this.actions = bindActionCreators(LobbyActions, dispatch);

        this.firebaseRef = new Firebase(`${FIREBASE_APP_URL}/games`);
        subscribeToFirebaseList(this.firebaseRef, {
            itemsLoaded: (items) => {
                this.setState({
                    games: objectToArray(items)
                });
            },
            itemAdded: (item) => {
                this.setState({
                    games: games ? games.concat([item]) : [item]
                });
            }
        });
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { games } = this.state;
        return <div styles={[styles.page]}>
            { _.map(games, (g, i) => <LobbyGame game={g} key={i} />) }
        </div>;
    }
}
