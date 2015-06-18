import React, { PropTypes, Component } from 'react';
import DropArea from './DropArea';
import ItemTypes from './ItemTypes';

export default class Basket{

  render() {
    return <DropArea accepts={[ItemTypes.ORANGE]} name="Basket"
                onDrop={this.props.onDrop} oranges={this.props.basket}>
        {this.props.children}
    </DropArea>;
  }
}
