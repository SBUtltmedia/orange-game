import React, { Component } from "react";
import { RouteHandler } from 'react-router';
import Menu from '../components/Menu';

export default class Application extends Component {
    render() {
        return <div>
            <Menu />
            <RouteHandler {...this.props} />
        </div>
    }
}
