import React from "react";
import Router from 'react-router';
import routes from "./routes";
import { APP_ROOT_ELEMENT } from './constants/Settings';

const mountNode = document.getElementById(APP_ROOT_ELEMENT);

Router.run(routes, function (Handler, state) {
    React.render(<Handler/>, mountNode);
});
