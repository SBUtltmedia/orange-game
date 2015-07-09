import React, { Component, PropTypes } from 'react';
import StyleSheet from'react-style';
import * as AdminActions from '../actions/AdminActions';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

@connect(state => ({
    games: state.lobby.games
}))
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
        </div>;
    }
}
