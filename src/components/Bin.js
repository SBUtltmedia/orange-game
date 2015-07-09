import React, { PropTypes, Component } from 'react';
import { verticalCenter, dnd } from '../styles/Themes';
import { connect } from 'redux/react';
import { forRange } from '../utils';
import ItemTypes from '../constants/ItemTypes';
import BinDisplay from './BinDisplay';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

@connect((state, props) => ({
    oranges: state.game.oranges[props.name],
    playerId: state.player.playerId
}))
export default class Bin extends Component {
    static propTypes = {
        oranges: PropTypes.number.isRequired,
        style: PropTypes.object,
        textual: PropTypes.bool,
        graphical: PropTypes.bool,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        playerId: PropTypes.string.isRequired
    };

    componentWillMount() {
        this.firebaseRef = new Firebase(`${FIREBASE_APP_URL}/players`);
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    componentWillReceiveProps(nextProps) {
        const { playerId, oranges, name } = nextProps;
        if (playerId) {
            const ref = new Firebase(`${FIREBASE_APP_URL}/players`);
            const data = {};
            data[name] = oranges;
            ref.child(`${playerId}/oranges`).update(data);    
        }
    }

    render() {
        const { name, oranges } = this.props;
        return <BinDisplay {...this.props} />;
    }
}
