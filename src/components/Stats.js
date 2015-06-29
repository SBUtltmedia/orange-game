import React, { PropTypes, Component } from 'react';
import { areaTheme, buttonTheme, verticalCenter } from '../styles/Themes';
import { connect } from 'redux/react';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgreen',
  },
  inner: {
      ...verticalCenter
  }
};

@connect(state => ({
    day: state.stats.day
}))
export default class Stats extends Component {
  static propTypes = {
      day: PropTypes.number.isRequired
  };

  render() {
    const { day } = this.props;

    return <div style={styles.container}>
        <div style={styles.inner}>
	         <p>Health points, days, etc.</p>
           <p>Day: {day}</p>
       </div>
    </div>;
  }
}
