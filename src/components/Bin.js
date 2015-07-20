import React, { PropTypes, Component } from 'react';
import { verticalCenter, dnd } from '../styles/Themes';
import { connect } from 'redux/react';
import { forRange, getFbRef } from '../utils';
import ItemTypes from '../constants/ItemTypes';
import BinDisplay from './BinDisplay';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

@connect((state, props) => ({
    oranges: state.game.oranges[props.name],
    fitness: state.game.fitness,
    gameId: state.game.id,
    playerId: state.game.playerId
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

    componentWillMount() {
        this.firebaseRef = getFbRef(`/games/${gameId}/players/${playerId}`);
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    componentWillReceiveProps(nextProps) {
        const { name, gameId, oranges, fitness } = nextProps;
        if (gameId) {
            const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}/players`);
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
