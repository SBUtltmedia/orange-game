import React, { Component, PropTypes } from 'react';
import StyleSheet from 'react-style';
import { Link } from 'react-router';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        height: '100%'
    }
});

export default class GameOver extends Component {

    render() {
        return <div style={styles.page}>
            <div>Game is finished.</div>
            <div><Link to="lobby">Play again</Link></div>
        </div>;
    }
}
