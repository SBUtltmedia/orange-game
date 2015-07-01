import React, { PropTypes, Component } from 'react/addons';
import { verticalCenter } from '../styles/Themes';
import { connect } from 'redux/react';
import Bin from './Bin';

const styles = {
    box: {
        ...verticalCenter,
        backgroundColor: 'yellow',
        width: "100%",
        height: 250
    },
    noOrangesMessage: {
        ...verticalCenter
    }
};

@connect(state => ({
    oranges: state.game.oranges.box
}))
export default class OrangeBox extends Component {
    static propTypes = {
        oranges: PropTypes.number.isRequired,
        actions: PropTypes.object.isRequired
    };

    render() {
        const { oranges, actions } = this.props;
        return <Bin style={styles.box} actions={actions}
                    oranges={oranges} name="Box" />
    }
}
