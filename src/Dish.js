import React, { PropTypes, Component } from 'react';
import DropArea from './DropArea';
import ItemTypes from './ItemTypes';

export default class Dish {

  render() {
    return <DropArea accepts={[ItemTypes.ORANGE]} name="Dish"
                onDrop={this.props.onDrop} oranges={this.props.dish}>
        {this.props.children}
    </DropArea>;
  }
}
