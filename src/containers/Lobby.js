import React, { Component } from 'react';
import StyleSheet from'react-style';
import Firebase from 'firebase';
import * as LobbyActions from '../actions/LobbyActions';
import { FIREBASE_APP_URL } from '../constants/Settings';
import { subscribeToFirebaseList } from '../utils';
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
        const { dispatch } = this.props;
        this.actions = bindActionCreators(LobbyActions, dispatch);

        this.firebaseRef = new Firebase(`${FIREBASE_APP_URL}/games`);
        subscribeToFirebaseList(this.firebaseRef, {
            itemsLoaded: (items) => {
                this.setState({
                    games: _.values(items)
                });
            },
            itemAdded: (item) => {
                this.setState({
                    games: games.concat([item])
                });
            }
        });
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        return <div styles={[styles.page]}>
            Lobby
        </div>;
    }
}
