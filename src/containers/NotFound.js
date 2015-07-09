import React, { Component } from 'react';
import StyleSheet from'react-style';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        color: "#F00",
        fontSize: 14,
        fontWeight: "bold",
        height: '100%'
    }
});

export default class NotFound extends Component {
    render() {
        return <div styles={[styles.page]}>
            404: Page not found
        </div>;
    }
}
