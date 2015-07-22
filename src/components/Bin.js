import React, { PropTypes, Component } from 'react';
import { verticalCenter, dnd } from '../styles/Themes';
import { connect } from 'redux/react';
import { forRange, getFbRef } from '../utils';
import ItemTypes from '../constants/ItemTypes';
import BinDisplay from './BinDisplay';

@connect((state, props) => ({
    oranges: state.game.oranges[props.name],
    fitness: state.game.fitness,
    playerId: state.game.playerId,
    gameId: state.game.id
}))
export default class Bin extends Component {
    static propTypes = {
        style: PropTypes.object,
        textual: PropTypes.bool,
        graphical: PropTypes.bool,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        oranges: PropTypes.number.isRequired,
        fitness: PropTypes.number.isRequired,
        gameId: PropTypes.string.isRequired,
        playerId: PropTypes.string.isRequired
    };

    componentWillReceiveProps(nextProps) {
        const { name, oranges, gameId, playerId, fitness } = nextProps;
        if (gameId) {
            const ref = getFbRef(`/games/${gameId}/players/${playerId}`);
            const data = {};
            data[name] = oranges;
            ref.child('oranges').update(data);
            ref.child('fitness').update({ fitness: fitness });
        }
    }

    render() {
        const { name, oranges } = this.props;
        return <BinDisplay {...this.props} />;
    }
}
