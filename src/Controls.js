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

  addToBasket() {
    alert('Not implemented');
  }

  addToDish() {
    alert('Not implemented');
  }

  render() {
    const {  } = this.props;
    return <div style={styles.container}>
      <button style={styles.button} onClick={this.addToBasket}>
        Add an orange to your basket
      </button>
      <button style={styles.button} onClick={this.addToDish}>
        Add an orange to your dish
      </button>
    </div>;
  }
}
