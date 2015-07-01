import React, { PropTypes, Component } from 'react/addons';
import DraggableOrange from './DraggableOrange';
import { DropTarget } from 'react-dnd';
import { verticalCenter } from '../styles/Themes';
import { forRange } from '../utils';
import ItemTypes from '../constants/ItemTypes';

const styles = {
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
    return 'Empty';
}

function renderTextual(oranges, name, label, isActive) {
    return <div>
        <p>{ isActive ? 'Release to drop' : name }</p>
        <p>{ label }: { oranges }</p>
    </div>;
}

function renderGraphical(oranges, name) {
    if (oranges > 0) {
        return renderOranges(oranges, name);
    }
    else {
        return renderNoOranges();
    }
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
        textual: PropTypes.bool,
        graphical: PropTypes.bool,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
    };

    render() {
        const { style, name, textual, graphical, label, oranges, isOver, canDrop, connectDropTarget } = this.props;
        const isActive = isOver && canDrop;
        let backgroundColor = style.backgroundColor || 'darkkhaki';
        if (isActive) {
            backgroundColor = 'darkgreen';
        }
        else if (canDrop) {
            backgroundColor = '#69F';
        }
        return connectDropTarget(
            <div style={{ ...style, backgroundColor }}>
                <div style={styles.inner}>
                    { textual ? renderTextual(oranges, name, label, isActive) : '' }
                    { graphical ? renderGraphical(oranges, name) : '' }
                </div>
            </div>
        );
    }
}
