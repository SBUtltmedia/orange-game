import React, { PropTypes, Component } from 'react';
import DropArea from './DropArea';
import ItemTypes from './ItemTypes';
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
    const { oranges } = this.props;
    return <DropArea accepts={[ItemTypes.ORANGE]} onDrop={this.onDrop.bind(this)}
              name="Dish" label="Oranges eaten" oranges={oranges} />
  }
}
