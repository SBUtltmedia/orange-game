import React, { PropTypes, Component } from 'react';
import { areaTheme, buttonTheme } from '../styles/Themes';
import OrangeBox from './OrangeBox';
import model from '../model';

const styles = {
  container: {
    ...areaTheme,
    backgroundColor: '#F7EAC8',
  },
  button: {
    ...buttonTheme,
    margin: 16,
    position: 'relative',
    top: 50
  }
};

export default class Controls extends Component {

    render() {
        return <div style={styles.container}>
            <OrangeBox />
            <button style={styles.button} disabled={!model.canAdvanceDay}
                                            onClick={model.newDay}>
                Let a new day begin
            </button>
            <button style={styles.button} onClick={() => alert('Not implemented')}>
                Offer/request a loan
            </button>
        </div>;
    }
}
