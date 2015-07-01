import React, { PropTypes, Component } from 'react/addons';
import DraggableOrange from './DraggableOrange';
import { verticalCenter } from '../styles/Themes';
import { connect } from 'redux/react';
import { range } from '../utils';

const styles = {
    box: {
        ...verticalCenter,
        backgroundColor: 'yellow',
        width: "100%",
        height: 250
    },
    noOrangesMessage: {
        ...verticalCenter
    }
};

function renderOranges(oranges) {
    return <div style={styles.box}>
        { range(oranges).map((x, i) => <DraggableOrange key={i} /> ) }
    </div>;
}

function renderNoOranges(oranges) {
    return <div style={styles.box}>
        <div style={styles.noOrangesMessage}>
            No oranges in box
        </div>
    </div>;
}

@connect(state => ({
    oranges: state.game.oranges.box
}))
export default class OrangeBox extends Component {
    static propTypes = {
        oranges: PropTypes.number.isRequired,
        actions: PropTypes.object.isRequired
    };

    render() {
        const { actions, oranges } = this.props;
        return <div style={styles.box}>
            { oranges > 0 ? renderOranges(oranges) : renderNoOranges() }
        </div>;
    }
}
