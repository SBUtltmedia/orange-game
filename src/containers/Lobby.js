import React, { Component } from 'react';
import StyleSheet from'react-style';
import Firebase from 'firebase';
import * as LobbyActions from '../actions/LobbyActions';
import LobbyGame from '../components/LobbyGame';
import LobbyGames from '../components/LobbyGames';
import LobbyPlayerName from '../components/LobbyPlayerName';
import { FIREBASE_APP_URL } from '../constants/Settings';
import { subscribeToFirebaseList, objectToArray } from '../utils';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

@connect(state => ({}))
export default class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            playerName: null
        };
    }

    promptForPlayerName() {
        const { actions } = this.props;
        if (!this.state.playerName) {
            const name = prompt("Please type your name");
            this.actions.loginUser(name);
        }
        else {
            console.log(this.state.playerName);
        }
    }

    componentWillMount() {
        const { dispatch, games } = this.props;
        this.actions = bindActionCreators(LobbyActions, dispatch);
        this.firebaseRef = new Firebase(`${FIREBASE_APP_URL}/games`);
        subscribeToFirebaseList(this.firebaseRef, {
            itemsLoaded: items => {
                this.setState({
                    games: objectToArray(items)
                });
            },
            itemAdded: item => {
                this.setState({
                    games: games ? games.concat([item]) : [item]
                });
            }
        });
        this.promptForPlayerName();
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        return <div style={styles.page}>
            <LobbyPlayerName actions={this.actions} />
            <LobbyGames actions={this.actions} />
        </div>;
    }
}
