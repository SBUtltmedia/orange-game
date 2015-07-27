import React from "react";
import Router from 'react-router';
import routes from "./routes";
import { Provider } from 'redux';
import { createRedux } from 'redux';
import * as reducers from './reducers';
import { APP_ROOT_ELEMENT } from './constants/Settings';

const store = createStore(reducers);
const mountNode = document.getElementById(APP_ROOT_ELEMENT);

Router.run(routes, function (Handler, state) {
    React.render(
        <Provider store={store}>
            { () => <Handler router={state} /> }
        </Provider>,
        mountNode
    );
});
