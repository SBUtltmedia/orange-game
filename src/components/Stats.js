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
    day: state.game.day,
    fitness: state.game.fitness,
    fitnessChange: state.game.fitnessChange
}))
export default class Stats extends Component {
  static propTypes = {
      day: PropTypes.number.isRequired,
      fitness: PropTypes.number.isRequired,
      fitnessChange: PropTypes.number.isRequired
  };

  render() {
    const { day, fitness, fitnessChange } = this.props;
    var fitnessChangeColor = getFitnessChangeColor(fitnessChange);

    return <div style={styles.container}>
        <div style={styles.inner}>
           <p>
              <span>Day:</span>
              &nbsp;
              <span style={styles.value}>{day}</span>
          </p>
           <p>
              <span>Fitness:</span>
              &nbsp;
              <span style={styles.value}>{fitness}</span>
           </p>
           <p>
              <span>Change:</span>
              &nbsp;
              <span style={{...styles.value, color: fitnessChangeColor}}>
                                {formatChange(fitnessChange)}
              </span>
           </p>
       </div>
    </div>;
  }
}
