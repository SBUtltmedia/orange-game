import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import LobbyGames from '../components/LobbyGames';
import LobbyUserName from '../components/LobbyUserName';
import EnterName from '../components/EnterName';
import { userName } from '../model';
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

    componentWillMount() {
        const { dispatch } = this.props;
        this.fluxActions = bindActionCreators(FluxActions, dispatch);
        this.fluxActions.listenToFirebase();
    }

    componentWillUnmount() {
        this.fluxActions.disconnectFromFirebase();
    }

    render() {
        return <div style={styles.page}>
            <LobbyUserName />
            <LobbyGames />
            <EnterName open={!!!userName} />
        </div>;
    }
}
