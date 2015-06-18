import React, { PropTypes, Component } from 'react';
import DropArea from './DropArea';
import ItemTypes from './ItemTypes';

export default class Dish {

  render() {

    return (
<DropArea

		  accepts={[ItemTypes.ORANGE]}
              onDrop={(item) => this.handleDrop()}
>
{this.props.children}
</DropArea>
    );
  }
}
