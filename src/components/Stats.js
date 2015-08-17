import React, { PropTypes, Component } from 'react';
import { areaTheme, verticalCenter } from '../styles/Themes';
import model from '../model';
import { connect } from 'redux/react';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgreen',
      width: 250
  },
  inner: {
      paddingLeft: 50,
      textAlign: 'left'
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
    firebase: state.firebase
}))
export default class Stats extends Component {

    render() {
        const { firebase } = this.props;
        if (firebase) {
            const { games } = firebase;
            if (games) {
                const game = games[model.gameId];
                const player = game.players[model.authId];
                const { fitness, fitnessChange, day } = player;
                var fitnessChangeColor = getFitnessChangeColor(fitnessChange);
                return <div style={styles.container}>
                    <br />
                    <h4>Your stats</h4>
                    <br /><br />
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
                        <p>
                            <span>Loans:</span>
                            <ul>
                                <li>John: <span style={styles.value}>3</span></li>
                            </ul>
                        </p>
                    </div>
                </div>;
            }
        }
        return <div style={styles.container}></div>  // fallback
    }
}
