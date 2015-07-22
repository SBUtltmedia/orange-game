import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import * as LobbyActions from '../actions/LobbyActions';
import LobbyGames from '../components/LobbyGames';
import LobbyUserName from '../components/LobbyUserName';
import EnterName from '../components/EnterName';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';
import { trimString, getFbRef } from '../utils';

function isNameAcceptable(name) {
    return trimString(name) !== '';  // TODO: Check for name taken
}

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

@connect(state => ({
    userName: state.user.name
}))
export default class Lobby extends Component {
    static propTypes = {
        userName: PropTypes.string.isRequired
    };

    componentWillMount() {
        const { dispatch } = this.props;
        this.actions = bindActionCreators(LobbyActions, dispatch);
        const ref = getFbRef('/');
        const auth = ref.getAuth();
        this.setState({
            loggedIn: auth !== null,
            authId: auth ? auth.uid : null
        });
    }

    componentDidMount() {
        const { loggedIn, authId } = this.state;
        if (loggedIn) {
            this.actions.getUserData(authId);
        }
    }

    render() {
        const { loggedIn } = this.state;
        return <div style={styles.page}>
            <LobbyUserName actions={this.actions} />
            <LobbyGames actions={this.actions} />
            <EnterName open={!loggedIn} actions={this.actions} />
        </div>;
    }
}
