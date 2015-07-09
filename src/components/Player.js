import React, { PropTypes, Component } from 'react';

const styles = {
    container: {
        color: 'lightblue',
        backgroundColor: 'blue',
        marginTop: 16,
        display: 'flex'
    },
    info: {
        margin: 5
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
            <div style={styles.info}>{name}</div>
            <div style={styles.info}>Fitness: {fitness || '-'}</div>
            <div style={styles.info}>Box: {oranges.box}</div>
            <div style={styles.info}>Basket: {oranges.basket}</div>
            <div style={styles.info}>Dish: {oranges.dish}</div>
        </div>;
    }
}
