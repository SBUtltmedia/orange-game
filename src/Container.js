import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd/modules/backends/HTML5';
import ItemTypes from './ItemTypes';
import update from 'react/lib/update';
import Controls from './Controls';
import OrangeBox from './OrangeBox';
import Basket from './Basket';
import Dish from './Dish';

const styles = {
  container: {
    display: "flex",
    backgroundColor: '#ffad00',
    color: '#000',
    height: "100%"
  }
}

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
        oranges: 10,
        basket: 0,
        dish: 0
    };
  }

  render() {
    return (
      <div style={styles.container}>
          <Basket onDrop={this.onBasketDrop.bind(this)} {...this.state} />
          <Controls {...this.state} />
	        <Dish onDrop={this.onDishDrop.bind(this)} {...this.state} />
      </div>
    );
  }

  onBasketDrop() {
    this.setState({
        oranges: this.state.oranges - 1,
        basket: this.state.basket + 1
    });
  }

  onDishDrop() {
    this.setState({
        oranges: this.state.oranges - 1,
        dish: this.state.dish + 1
    });
  }
}
