import React, { PropTypes, Component } from 'react';
import { areaTheme, buttonTheme } from './Themes';
import OrangeBox from './OrangeBox';

const styles = {
  container: {
    ...areaTheme,
    backgroundColor: '#F7EAC8',
  },
  button: {
    ...buttonTheme,
    margin: 16,
    position: 'relative',
    top: 120
  }
};

export default class Controls extends Component {
  static propTypes = {

  };

  render() {
    const {  } = this.props;
    return <div style={styles.container}>
	     <OrangeBox {...this.props} />
       <button style={styles.button}>Let a new day begin</button>
    </div>;
  }
}
