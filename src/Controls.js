import React, { PropTypes, Component } from 'react';
import { areaTheme } from './Themes';
import OrangeBox from './OrangeBox';

const styles = {
  container: {
    ...areaTheme,
    backgroundColor: '#F7EAC8',
  }
};

export default class Controls extends Component {
  static propTypes = {

  };

  render() {
    const {  } = this.props;
    return <div style={styles.container}>
	     <OrangeBox {...this.props} />
    </div>;
  }
}
