import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import * as AdminActions from '../actions/AdminActions';
import LobbyGames from '../components/LobbyGames';
import { bindActionCreators, connect } from 'redux';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        textAlign: 'center'
    }
});

@connect(state => ({}))
export default class Admin extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        this.actions = bindActionCreators(AdminActions, dispatch);
    }

    render() {
        const { createGame } = this.actions;
        return <div styles={[styles.page]}>
            <button style={styles.button} onClick={createGame}>
                Create new game
            </button>
            <LobbyGames isAdmin={true} actions={this.actions} />
        </div>;
    }
}
