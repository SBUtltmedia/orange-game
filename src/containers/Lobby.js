import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import * as LobbyActions from '../actions/LobbyActions';
import LobbyGames from '../components/LobbyGames';
import LobbyUserName from '../components/LobbyUserName';
import EnterName from '../components/EnterName';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

// TODO: Move isNameAcceptable to the right component
import { trimString, getUserData } from '../utils';
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

    };

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
    }

    componentWillMount() {
        const { dispatch } = this.props;
        this.actions = bindActionCreators(LobbyActions, dispatch);
        getUserData(this);
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
