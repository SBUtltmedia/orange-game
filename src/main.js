import React from "react";
import Router from 'react-router';
import routes from "./routes";
import { Provider } from 'redux/react';
import { createRedux } from 'redux';
import * as stores from './stores';
import { APP_ROOT_ELEMENT } from './constants/Settings'; 

const redux = createRedux(stores);
const mountNode = document.getElementById(APP_ROOT_ELEMENT);

Router.run(routes, function (Handler, state) {
    React.render(
        <Provider redux={redux}>
            { () => <Handler router={state} /> }
        </Provider>,
        mountNode
    );
});
