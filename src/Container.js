import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd/modules/backends/HTML5';
import ItemTypes from './ItemTypes';
import update from 'react/lib/update';
import Controls from './Controls';
import OrangeBox from './OrangeBox';
import Basket from './Basket';

const styles = {
  container: {
    display: "flex",
    backgroundColor: '#ffad00',
    color: '#000',
    height: "100%",
    width: "100%"
  }
}

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  isDropped(boxName) {
    return this.state.droppedBoxNames.indexOf(boxName) > -1;
  }

  render() {
    const { boxes, dustbins } = this.state;

    return (
      <div style={styles.container}>
          <Basket accepts={[ItemTypes.ORANGE]}
              onDrop={(item) => this.handleDrop()}
           />
          <Controls />
          <OrangeBox />
      </div>
    );
  }

  handleDrop() {
    console.log("You dropped an orange!");
    this.setState(update(this.state, {

    }));
  }
}
