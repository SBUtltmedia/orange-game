import React, { PropTypes, Component } from 'react';
import { areaTheme, buttonTheme, verticalCenter } from './Themes';
import OrangeBox from './OrangeBox';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgreen',
  },
  inner: {
      ...verticalCenter
  }
};

export default class Stats extends Component {
  static propTypes = {

  };

  render() {
    const {  } = this.props;
    return <div style={styles.container}>
        <div style={styles.inner}>
	         Health points, days, etc.
       </div>
    </div>;
  }
}
