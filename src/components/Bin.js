import React, { PropTypes, Component } from 'react';
import { verticalCenter, dnd } from '../styles/Themes';
import { connect } from 'redux/react';
import { forRange, getFbRef } from '../utils';
import ItemTypes from '../constants/ItemTypes';
import BinDisplay from './BinDisplay';

@connect(state => ({
    game: state.game
}))
export default class Bin extends Component {
    static propTypes = {
        style: PropTypes.object,
        textual: PropTypes.bool,
        graphical: PropTypes.bool,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        game: PropTypes.object.isRequired
    };

    componentWillReceiveProps(nextProps) {
        const { game } = nextProps;
        const { gameId, playerId } = game;
        if (gameId && playerId) {
            const ref = getFbRef(`/games/${gameId}/players/${playerId}`);
            ref.update(game);
        }
    }

    render() {
        const { name, oranges } = this.props;
        return <BinDisplay {...this.props} />;
    }
}
