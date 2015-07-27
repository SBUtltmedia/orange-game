import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import LobbyGames from '../components/LobbyGames';
import LobbyUserName from '../components/LobbyUserName';
import EnterName from '../components/EnterName';

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

@connect(state => ({}))
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
        getUserData(this);
    }

    render() {
        const { loggedIn } = this.state;
        return <div style={styles.page}>
            <LobbyUserName />
            <LobbyGames />
            <EnterName open={!loggedIn} />
        </div>;
    }
}
