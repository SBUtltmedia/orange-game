import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from '../constants/ItemTypes';
import { orangeStyle } from '../styles/Themes';

const boxSource = {
    beginDrag(props) {
        return {
            source: props.source
        };
    }
};

@DragSource(ItemTypes.ORANGE, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class DraggableOrange extends Component {
    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        source: PropTypes.string.isRequired
    };

    render() {
        const { connectDragSource, isDragging, disabled } = this.props;
        const opacity = isDragging ? 0.4 : 1;
        if (disabled) {
            return <img style={{opacity}, orangeStyle}
                    src={require("../../images/disabled_orange_small.png")} />;
        }
        else {
            return connectDragSource(
                <img style={{opacity}, orangeStyle}
                src={require("../../images/orange_small.png")} />
            );
        }
    }
}
