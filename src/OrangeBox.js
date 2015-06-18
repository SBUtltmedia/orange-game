import React, { PropTypes, Component } from 'react';
import DraggableOrange from './DraggableOrange';
import { verticalCenter } from './Themes';

const styles = {
    box: {
        backgroundColor: 'yellow',
        width: "100%",
        marginTop: "70%",
        height: "30%"
    }
};

export default class OrangeBox extends Component {
  render() {
    return <div style={styles.box}>
      <DraggableOrange foo="blah"/>
    </div>;
  }
l}
