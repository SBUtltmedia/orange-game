import React, { PropTypes, Component } from 'react';
import DropArea from './DropArea';
import ItemTypes from './ItemTypes';

export default class Basket{

  render() {
    return <DropArea accepts={[ItemTypes.ORANGE]} name="Basket" {...this.props}>
        {this.props.children}
    </DropArea>;
  }
}
