import React, { PropTypes, Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';
import { LINK_COLOR } from '../styles/Themes';

const styles = StyleSheet.create({
    menu: {
        textAlign: "center",
        paddingTop: 16,
        marginBottom: 16
    },
    item: {
        color: LINK_COLOR,
        fontSize: 14,
        fontWeight: 'bold',
        margin: 16
    }
});

export default class Menu extends Component {

    render() {
        return <div styles={[styles.menu]}>
            <Link to="/" styles={[styles.item]}>Lobby</Link>
            <Link to="game" styles={[styles.item]}>Game</Link>
            <Link to="admin" styles={[styles.item]}>Admin</Link>
            <Link to="about" styles={[styles.item]}>About</Link>
        </div>;
    }
}
