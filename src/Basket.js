import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import theme from './Theme';

const styles = {
  container: {
    ...theme,
    width: 450,
    height: 450
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
export default class Basket extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    onDrop: PropTypes.func.isRequired
  };

  render() {
    const { accepts, isOver, canDrop, connectDropTarget, lastDroppedItem } = this.props;
    const isActive = isOver && canDrop;
    let backgroundColor = 'darkkhaki';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = '#69F';
    }

    return connectDropTarget(
      <div style={{ ...styles.container, backgroundColor }}>
        { isActive ? 'Release to drop' : 'Your basket' }
      </div>
    );
  }
}
