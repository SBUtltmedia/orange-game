import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd/modules/backends/HTML5';
import ItemTypes from './ItemTypes';
import update from 'react/lib/update';
import Controls from './Controls';
import OrangeBox from './OrangeBox';
import Basket from './Basket';
import Dish from './Dish';
import Stats from './Stats';
import { areaTheme } from './Themes';

const styles = {
  container: {
    backgroundColor: '#ffad00',
    color: '#000',
    height: "100%"
  },
  row: {
      display: "flex",
      height: areaTheme.height + areaTheme.margin
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
          <div style={styles.row}>
              <Basket onDrop={this.onBasketDrop.bind(this)} oranges={this.state.basket} />
              <Controls oranges={this.state.oranges} />
    	        <Dish onDrop={this.onDishDrop.bind(this)} oranges={this.state.dish} />
          </div>
          <div style={styles.row}>
              <Stats />
          </div>
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
