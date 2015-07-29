import React, { PropTypes, Component } from 'react';
import { verticalCenter } from '../styles/Themes';
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

export default class OrangeBox extends Component {

    render() {
        return <Bin style={styles.box} textual={false} graphical={true}
                    name="box" showName={false} />
    }
}
