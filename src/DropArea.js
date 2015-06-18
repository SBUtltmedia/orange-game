import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import { areaTheme } from './Themes';
import ItemTypes from './ItemTypes';

const styles = {
  container: {
    ...areaTheme,
  }
};

const dustbinTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
};

@DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class DropArea extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    onDrop: PropTypes.func.isRequired
  };

  render() {
  const { accepts, isOver, canDrop, connectDropTarget } = this.props;
   //const {connectDropTarget, isOver, canDrop, accepts, onDrop} = this.props;
	  const isActive = isOver && canDrop;
    let backgroundColor = 'darkkhaki';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = '#69F';
    }

    return connectDropTarget(
      <div style={{ ...styles.container, backgroundColor }}
//	  		accepts={[ItemTypes.ORANGE]}
  //            onDrop={(item) => this.handleDrop()}
	  >
        { isActive ? 'Release to drop' : 'Your basket' }
      </div>
    );
  }
}
