import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import ItemTypes from '../constants/ItemTypes';
import { connect } from 'redux/react';
import { areaTheme } from '../styles/Themes';

const styles = {
    container: {
      ...areaTheme
    }
}

@connect(state => ({
    oranges: state.game.oranges.dish
}))
export default class Dish {
  static propTypes = {
    oranges: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { oranges, actions } = this.props;
    return <Bin actions={actions} style={styles.container}
                textual={true} graphical={true}
              name="Dish" label="Oranges eaten" oranges={oranges} />
  }
}
