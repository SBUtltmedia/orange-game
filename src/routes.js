import React from "react";
import { Route, DefaultRoute, NotFoundRoute, Redirect } from "react-router";
import Application from "./containers/Application";
import About from "./containers/About";
import Game from "./containers/Game";
import NotFound from "./containers/NotFound";

export default (
    <Route name="app" handler={Application} path="/">
        <DefaultRoute name="home" handler={Game} />
        <Route name="about" handler={About} />
        <NotFoundRoute name="not-found" handler={NotFound} />
        <Redirect from="company" to="about" />
    </Route>
);
