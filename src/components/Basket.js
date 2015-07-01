import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import ItemTypes from '../constants/ItemTypes';
import { connect } from 'redux/react';

@connect(state => ({
    oranges: state.game.oranges.basket
}))
export default class Basket{
  static propTypes = {
    oranges: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, oranges } = this.props;
    return <Bin actions={actions}
              name="Basket" label="Oranges saved" oranges={oranges} />
  }
}
