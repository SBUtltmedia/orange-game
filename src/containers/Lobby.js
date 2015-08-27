import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import LobbyGames from '../components/LobbyGames';
import LobbyUserName from '../components/LobbyUserName';
import EnterName from '../components/EnterName';
import { NOT_STARTED, STARTED, FINISHED } from '../constants/GameStates';
import model from '../model';
import * as FluxActions from '../actions/FluxActions';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

@connect(state => ({
    firebase: state.firebase
}))
export default class Lobby extends Component {

    gotoGameIfJoinedAndStarted(firebase) {
        const { isAdmin } = this.props;
        const { games } = firebase;
        if (!isAdmin) {
            const joinedGameId = _.findKey(games, g => {
                return _.contains(_.keys(g.players), model.authId) &&
                            g.state === STARTED;
            });
            if (joinedGameId) {
                window.location.href = `/?#/game/${joinedGameId}`;
            }
        }
    }

    componentWillMount() {
        const { dispatch } = this.props;
        this.fluxActions = bindActionCreators(FluxActions, dispatch);
        this.fluxActions.listenToFirebase();
    }

    componentWillUnmount() {
        this.fluxActions.disconnectFromFirebase();
    }

    componentWillReceiveProps(newProps) {
        const { firebase } = newProps;
        if (firebase) {
            this.gotoGameIfJoinedAndStarted(firebase);
        }
    }

    render() {
        return <div style={styles.page}>
            <LobbyUserName />
            <LobbyGames />
            <EnterName />
        </div>;
    }
}
