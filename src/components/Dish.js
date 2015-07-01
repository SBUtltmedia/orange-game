import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import ItemTypes from '../constants/ItemTypes';
import { connect } from 'redux/react';

@connect(state => ({
    oranges: state.game.oranges.dish
}))
export default class Dish {
  static propTypes = {
    oranges: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  };

  onDrop(item) {
      const { actions } = this.props;
      if (item.source === 'Box') {
          actions.boxToDish();
      }
      else {
          actions.basketToDish();
      }
  }

  render() {
    const { oranges, actions } = this.props;
    return <Bin actions={actions}
              name="Dish" label="Oranges eaten" oranges={oranges} />
  }
}
