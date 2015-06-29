import React, { PropTypes, Component } from 'react';
import DropArea from './DropArea';
import ItemTypes from './ItemTypes';
import { connect } from 'redux/react';

@connect(state => ({
    oranges: state.oranges.basket
}))
export default class Basket{
  static propTypes = {
    oranges: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, oranges } = this.props;
    return <DropArea accepts={[ItemTypes.ORANGE]} onDrop={actions.dropInBasket}
              name="Basket" label="Oranges saved" oranges={oranges} />
  }
}
