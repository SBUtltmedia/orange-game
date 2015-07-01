import React, { PropTypes, Component } from 'react/addons';
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
      actions.fetchOranges(day);
  }

  newDay() {
      const { actions, day } = this.props;
      actions.newDay();
      actions.fetchOranges(day);
  }

  render() {
    return <div style={styles.container}>
	     <OrangeBox {...this.props} />
       <button style={styles.button} onClick={this.newDay.bind(this)}>Let a new day begin</button>
    </div>;
  }
}
