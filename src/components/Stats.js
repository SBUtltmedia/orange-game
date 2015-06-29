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
  },
  value: {
    fontWeight: 'bold'
  }
};

function getFitnessChangeColor(change) {
    if (change > 0) {
      return 'green';
    }
    else if (change < 0) {
      return 'red';
    }
    else {
      return 'black';
    }
}

function formatChange(change) {
    if (change > 0) {
      return '+' + change;
    }
    else {
      return change;
    }
}

@connect(state => ({
    stats: state.stats
}))
export default class Stats extends Component {
  static propTypes = {
      stats: PropTypes.object.isRequired
  };

  render() {
    const { stats } = this.props;
    const change = stats.fitnessChange;
    var fitnessChangeColor = getFitnessChangeColor(change);

    return <div style={styles.container}>
        <div style={styles.inner}>
           <p>
              <span>Day:</span>
              &nbsp;
              <span style={styles.value}>{stats.day}</span>
          </p>
           <p>
              <span>Fitness:</span>
              &nbsp;
              <span style={styles.value}>{stats.fitness}</span>
           </p>
           <p>
              <span>Change:</span>
              &nbsp;
              <span style={{...styles.value, color: fitnessChangeColor}}>
                  {formatChange(change)}
              </span>
           </p>
       </div>
    </div>;
  }
}
