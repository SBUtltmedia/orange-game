import React from "react";
import Router from 'react-router';
import routes from "./routes";
import { Provider } from 'redux/react';
import { createRedux } from 'redux';
import * as stores from './stores';

const redux = createRedux(stores);
const mountNode = document.getElementById("root");

Router.run(routes, function (Handler, state) {
    React.render(
        <Provider redux={redux}>
            { () => <Handler router={state} /> }
        </Provider>,
        mountNode
    );
});
