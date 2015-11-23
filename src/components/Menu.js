import React, { PropTypes, Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';

const styles = StyleSheet.create({
    menu: {
        textAlign: "center",
        paddingTop: 16,
        marginBottom: 16
    },
    item: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 16
    }
});

export default class Menu extends Component {

    render() {
        return <div styles={[styles.menu]}>
            <Link to="/" styles={[styles.item]}>Lobby</Link>
            <Link to="admin" styles={[styles.item]}>Admin</Link>
            <Link to="about" styles={[styles.item]}>About</Link>
            <Link to="data" styles={[styles.item]}>Data</Link>
        </div>;
    }
}
