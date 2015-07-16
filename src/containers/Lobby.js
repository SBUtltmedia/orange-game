import React, { Component } from 'react';
import StyleSheet from'react-style';
import * as LobbyActions from '../actions/LobbyActions';
import LobbyGames from '../components/LobbyGames';
import LobbyPlayerName from '../components/LobbyPlayerName';
import EnterName from '../components/EnterName';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';
import { trimString } from '../utils';

function isNameAcceptable(name) {
    return trimString(name) !== '';  // TODO: Check for name taken
}

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

@connect(state => ({
    userName: state.player.name
}))
export default class Lobby extends Component {

    componentWillMount() {
        const { dispatch, games, userName } = this.props;
        this.actions = bindActionCreators(LobbyActions, dispatch);
    }

    render() {
        const { userName } = this.props;
        return <div style={styles.page}>
            <LobbyPlayerName actions={this.actions} />
            <LobbyGames actions={this.actions} />
            <EnterName open={userName === null} actions={this.actions} />
        </div>;
    }
}