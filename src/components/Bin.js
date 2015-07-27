import React, { PropTypes, Component } from 'react';
import { verticalCenter, dnd } from '../styles/Themes';
import { connect } from 'redux';
import { forRange, getFbRef } from '../utils';
import ItemTypes from '../constants/ItemTypes';
import BinDisplay from './BinDisplay';
import _ from 'lodash';

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

    render() {
        return <BinDisplay {...this.props} />;
    }
}
