import React, { PropTypes, Component } from 'react';
import DraggableOrange from './DraggableOrange';
import { DropTarget } from 'react-dnd';
import { verticalCenter, dnd } from '../styles/Themes';
import ItemTypes from '../constants/ItemTypes';
import _ from 'lodash';
import { dropOrange } from '../actions/GameActions';
import model from '../model';
import { shouldDisableMyOranges } from '../gameUtils';
import { connect } from 'redux/react';

const styles = {
    inner: {
        ...verticalCenter
    },
    defaultBgColor: 'darkkhaki'
};

const binTarget = {
    drop(props, monitor) {
        const { firebase } = props;
        dropOrange(monitor.getItem().source, props.name, firebase);
    }
};

@connect(state => ({
    firebase: state.firebase
}))
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
        name: PropTypes.string.isRequired,
        oranges: PropTypes.number.isRequired
    };

    renderOranges(oranges, name) {
        const { firebase } = this.props;
        return _.map(_.range(oranges), i =>
                    <DraggableOrange key={i} source={name}
                    disabled={shouldDisableMyOranges(firebase)} />);
    }

    renderNoOranges(oranges) {
        return 'Empty';
    }

    renderTextual(oranges, name, label, isActive) {
        return <div>
            <p>{ isActive ? 'Release to drop' : _.capitalize(name) }</p>
            <p>{ label }: { oranges }</p>
        </div>;
    }

    renderGraphical(oranges, name) {
        if (oranges > 0) {
            return this.renderOranges(oranges, name);
        }
        else {
            return this.renderNoOranges();
        }
    }

    render() {
        const { style, name, textual, graphical, label, isOver,
                    canDrop, connectDropTarget, oranges } = this.props;
        const { gameId, authId } = model;
        const isActive = isOver && canDrop;
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
                    { textual ? this.renderTextual(oranges, name, label, isActive) : '' }
                    { graphical ? this.renderGraphical(oranges, name) : '' }
                </div>
            </div>
        );
    }
}
