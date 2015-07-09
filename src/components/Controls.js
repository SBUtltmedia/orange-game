import React, { PropTypes, Component } from 'react';
import { areaTheme, buttonTheme } from '../styles/Themes';
import OrangeBox from './OrangeBox';
import { connect } from 'redux/react';

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

@connect(state => ({
    day: state.game.day,
}))
export default class Controls extends Component {
    static propTypes = {
        day: PropTypes.number.isRequired,
        actions: PropTypes.object.isRequired
    };

    componentDidMount() {
        const { actions, day } = this.props;
        actions.newDay(1);  // TODO: Probably remove this after transition
                            // TODO: from REST to Firebase
    }

    render() {
        const { actions, day } = this.props;
        const { newDay } = actions;
        return <div style={styles.container}>
            <OrangeBox {...this.props} />
            <button style={styles.button} onClick={newDay.bind(this, day + 1)}>
                Let a new day begin
            </button>
            <button style={styles.button} onClick={() => alert('Not implemented')}>
                Offer/request a loan
            </button>
        </div>;
    }
}
