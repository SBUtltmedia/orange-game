import React, { PropTypes, Component } from 'react';
import theme from './Theme';
import DraggableOrange from './DraggableOrange';

const styles = {
    box: {
      ...theme,
      backgroundColor: 'yellow',
      width: 450,
      height: 450
    }
};

export default class OrangeBox extends Component {
  render() {
    return <div style={styles.box}>
      <DraggableOrange />
    </div>;
  }
}
