import React, { Component } from "react";
import { RouteHandler } from 'react-router';
import Menu from '../components/Menu';

//require('react-widgets/dist/css/react-widgets.css');

export default class Application extends Component {
    render() {
        return <div>
            <Menu />
            <RouteHandler {...this.props} />
        </div>
    }
}
