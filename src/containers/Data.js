import React, { Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        height: '100%'
    }
});

export default class Data extends Component {

    render() {
        const data = '1,2,3';
        return <div styles={[styles.page]}>
            <a download="orange-game_data.csv"
                href={"data:text/csv;charset=utf-8,"+ data}>Download</a>
        </div>;
    }
}
