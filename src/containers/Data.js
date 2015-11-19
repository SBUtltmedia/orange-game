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
        var obj = {a: 123, b: "4 5 6"};
        const data = encodeURIComponent(JSON.stringify(obj));
        return <div styles={[styles.page]}>
            <a download="orange-game_data.json"
                href={"data:text/json;charset=utf-8,"+ data}>Download</a>
        </div>;
    }
}
