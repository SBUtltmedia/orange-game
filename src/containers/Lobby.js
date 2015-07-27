import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import LobbyGames from '../components/LobbyGames';
import LobbyUserName from '../components/LobbyUserName';
import EnterName from '../components/EnterName';
import { authId, userName } from '../model';
import { getFbObject, getFbRef } from '../utils';

// TODO: Move isNameAcceptable to the right component
import { trimString } from '../utils';
function isNameAcceptable(name) {
    return trimString(name) !== '';  // TODO: Check for name taken
}

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

export default class Lobby extends Component {

    render() {
        return <div style={styles.page}>
            <LobbyUserName />
            <LobbyGames />
            <EnterName open={!!!userName} />
        </div>;
    }
}
