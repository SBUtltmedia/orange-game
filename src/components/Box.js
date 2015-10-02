import React, { PropTypes, Component } from 'react';
import { verticalCenter } from '../styles/Themes';
import Bin from './Bin';
import { getOrangesInMyBox } from '../gameUtils';
import { connect } from 'redux/react';

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

@connect(state => { return {
    firebase: state.firebase
}})
export default class Box extends Component {

    render() {
        const { firebase } = this.props;
        const oranges = getOrangesInMyBox(firebase);
        return <Bin style={styles.box} textual={false} graphical={true}
                    name="box" showName={false} oranges={oranges} />
    }
}
