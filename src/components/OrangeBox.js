import React, { PropTypes, Component } from 'react/addons';
import DraggableOrange from './DraggableOrange';
import { verticalCenter } from '../styles/Themes';
import { connect } from 'redux/react';

const styles = {
    box: {
        ...verticalCenter,
        backgroundColor: 'yellow',
        width: "100%",
        height: 250
    }
};

@connect(state => ({
    oranges: state.oranges.box
}))
export default class OrangeBox extends Component {
  static propTypes = {
      oranges: PropTypes.number.isRequired,
      actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, oranges } = this.props;
    return <div style={styles.box}>
        {
            Array.apply(0, Array(oranges)).map((x, i) => {
                return <DraggableOrange key={i} />;
            })
        }
    </div>;
  }
}
