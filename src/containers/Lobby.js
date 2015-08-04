import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import LobbyGames from '../components/LobbyGames';
import LobbyUserName from '../components/LobbyUserName';
import EnterName from '../components/EnterName';
import { authId, userName } from '../model';
import { getFbObject, getFbRef } from '../utils';

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
