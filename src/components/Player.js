import React, { PropTypes, Component } from 'react';

const styles = {
    container: {
        color: 'lightblue',
        backgroundColor: 'blue',
        marginTop: 16,
        paddingLeft: 12,
        display: 'flex'
    },
    info: {
        margin: '5px 8px'
    },
    name: {
        width: '25%',
        textAlign: 'left'
    }
};

export default class Player extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        oranges: PropTypes.object.isRequired,
        fitness: PropTypes.number.isRequired
    };

    render() {
        const { name, oranges, fitness } = this.props;
        return <div style={styles.container}>
            <div style={{...styles.info, ...styles.name}}>{name}</div>
            <div style={styles.info}>Fitness: {fitness || 0}</div>
            <div style={styles.info}>Box: {oranges ? oranges.box : 0}</div>
            <div style={styles.info}>Basket: {oranges ? oranges.basket : 0}</div>
            <div style={styles.info}>Dish: {oranges ? oranges.dish : 0}</div>
        </div>;
    }
}
