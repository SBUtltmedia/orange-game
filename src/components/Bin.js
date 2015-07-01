import React, { PropTypes, Component } from 'react/addons';
import DraggableOrange from './DraggableOrange';
import { DropTarget } from 'react-dnd';
import { areaTheme, verticalCenter } from '../styles/Themes';
import { forRange } from '../utils';
import ItemTypes from '../constants/ItemTypes';

const styles = {
  container: {
    ...areaTheme
  },
  inner: {
      ...verticalCenter
  }
};

const dustbinTarget = {
  drop(props, monitor) {
    props.actions.dropOrange(monitor.getItem().source, props.name);  // source, dest
  }
};

function renderOranges(oranges, name) {
    return forRange(oranges, i => <DraggableOrange key={i} source={name} />);
}

function renderNoOranges(oranges) {
    return <div style={styles.inner}>Empty</div>;
}

@DropTarget(ItemTypes.ORANGE, dustbinTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
export default class Bin extends Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        oranges: PropTypes.number.isRequired,
        style: PropTypes.object,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    };

    render() {
        const { style, name, label, oranges, isOver, canDrop, connectDropTarget } = this.props;
        const isActive = isOver && canDrop;
        let backgroundColor = 'darkkhaki';
        if (isActive) {
            backgroundColor = 'darkgreen';
        }
        else if (canDrop) {
            backgroundColor = '#69F';
        }
        return connectDropTarget(
            <div style={{ ...styles.container, ...style, backgroundColor }}>
                <div style={styles.inner}>
                    <p>{ isActive ? 'Release to drop' : name }</p>
                    <p>{ label }: { oranges }</p>
                    { oranges > 0 ? renderOranges(oranges, name) : renderNoOranges() }
                </div>
            </div>
        );
    }
}
