import React, { PropTypes, Component } from 'react';

const styles = {
    container: {
        color: 'lightblue',
        backgroundColor: 'blue',
        marginTop: 16
    }
};

export default class Player extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
    };

    render() {
        const { name } = this.props;
        return <div style={styles.container}>
            {name}
        </div>;
    }
}
