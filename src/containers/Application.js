import React, { Component } from "react";
import StyleSheet from'react-style';
import { RouteHandler } from 'react-router';
import Menu from '../components/Menu';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffad00'
    }
});

export default class Application extends Component {
    render() {
        return <div style={styles.page}>
            <Menu />
            <RouteHandler {...this.props} />
        </div>
    }
}
