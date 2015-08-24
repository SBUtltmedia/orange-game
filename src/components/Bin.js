import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';
import BinDisplay from './BinDisplay';

@connect(state => ({
    firebase: state.firebase
}))
export default class Bin extends Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        style: PropTypes.object,
        textual: PropTypes.bool,
        graphical: PropTypes.bool,
        name: PropTypes.string.isRequired
    };

    render() {
        return <BinDisplay {...this.props} />
    }
}
