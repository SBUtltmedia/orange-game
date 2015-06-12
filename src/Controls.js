import React, { PropTypes, Component } from 'react';
import theme from './Theme';

const styles = {
  container: {
    ...theme,
    backgroundColor: '#F7EAC8',
    width: 450,
    height: 450
  },
  button: {
    ...theme,
    margin: 16
  }
};

export default class Controls extends Component {
  static propTypes = {

  };

  render() {
    const {  } = this.props;
    return <div style={styles.container}>
      <button style={styles.button}>Add an orange to your basket</button>
      <button style={styles.button}>Add an orange to your disk</button>
    </div>;
  }
}
