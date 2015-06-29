import React, { PropTypes, Component } from 'react';
import DropArea from './DropArea';
import ItemTypes from './ItemTypes';
import { connect } from 'redux/react';

@connect(state => ({
    oranges: state.oranges.dish
}))
export default class Dish {
  static propTypes = {
    oranges: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, oranges } = this.props;
    return <DropArea accepts={[ItemTypes.ORANGE]} onDrop={actions.dropInDish}
              name="Dish" label="Oranges eaten" oranges={oranges} />
  }
}
