import React, { PropTypes, Component } from 'react';
import { verticalCenter, dnd } from '../styles/Themes';
import { connect } from 'redux/react';
import { forRange, getFbRef } from '../utils';
import ItemTypes from '../constants/ItemTypes';
import BinDisplay from './BinDisplay';
import _ from 'lodash';

@connect(state => ({
    game: state.game,
    authId: state.user.authId
}))
export default class Bin extends Component {
    static propTypes = {
        style: PropTypes.object,
        textual: PropTypes.bool,
        graphical: PropTypes.bool,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        game: PropTypes.object.isRequired,
        authId: PropTypes.string.isRequired
    };

    componentWillReceiveProps(nextProps) {
        const { game, authId } = nextProps;
        const { gameId } = game;
        if (gameId && authId) {
            const ref = getFbRef(`/games/${gameId}/players/${authId}`);
            ref.update(_.omit(game, ['gameId', 'authId']));
        }
    }

    render() {
        const { name, oranges } = this.props;
        return <BinDisplay {...this.props} />;
    }
}
