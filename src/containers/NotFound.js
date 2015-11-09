import React, { Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        height: '100%'
    },
    error: {
        color: "#F00",
        fontSize: 14,
        fontWeight: "bold"
    }
});

export default class NotFound extends Component {
    render() {
        return <div styles={[styles.page]}>
            <div styles={[styles.error]}>404: Page not found</div>
            <div><Link to="lobby">Go home</Link></div>
        </div>;
    }
}
