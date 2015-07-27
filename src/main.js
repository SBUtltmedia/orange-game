import React from "react";
import Router from 'react-router';
import { createStore, combineReducers, Provider } from 'redux';
import * as reducers from './reducers';
import { APP_ROOT_ELEMENT } from './constants/Settings';
import { Route, DefaultRoute, NotFoundRoute, Redirect } from "react-router";
import Application from "./containers/Application";
import Lobby from "./containers/Lobby";
import Game from "./containers/Game";
import Admin from "./containers/Admin";
import About from "./containers/About";
import NotFound from "./containers/NotFound";

const reducer = combineReducers(reducers);
const store = createStore(reducer);
const mountNode = document.getElementById(APP_ROOT_ELEMENT);

React.render(
    <Provider store={store}>
        <Router>
            <Route name="app" handler={Application} path="/">
                <DefaultRoute name="home" handler={Lobby} />
                <Route name="game" path="game/:gameId" handler={Game} />
                <Route name="admin" handler={Admin} />
                <Route name="about" handler={About} />
                <NotFoundRoute name="not-found" handler={NotFound} />
            </Route>
        </Router>
    </Provider>,
    mountNode
);
