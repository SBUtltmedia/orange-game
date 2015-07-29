import React, { PropTypes, Component } from 'react';
import DraggableOrange from './DraggableOrange';
import { DropTarget } from 'react-dnd';
import { verticalCenter, dnd } from '../styles/Themes';
import { forRange } from '../utils';
import ItemTypes from '../constants/ItemTypes';
import _ from 'lodash';
import { dropOrange } from '../actions/GameActions';
import model from '../model';

const styles = {
  inner: {
      ...verticalCenter
  },
  defaultBgColor: 'darkkhaki'
};

const binTarget = {
    drop(props, monitor) {
        dropOrange(monitor.getItem().source, props.name);
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
        <p>{ isActive ? 'Release to drop' : _.capitalize(name) }</p>
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

@DropTarget(ItemTypes.ORANGE, binTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
export default class Bin extends Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        style: PropTypes.object,
        textual: PropTypes.bool,
        graphical: PropTypes.bool,
        name: PropTypes.string.isRequired
    };

    render() {
        const { style, name, textual, graphical, label, isOver,
                    canDrop, connectDropTarget } = this.props;
        const isActive = isOver && canDrop;
        const oranges = model.oranges[name];
        let backgroundColor = style.backgroundColor || styles.defaultBgColor;
        if (isActive) {
            backgroundColor = dnd.isActive;
        }
        else if (canDrop) {
            backgroundColor = dnd.canDrop;
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
