import React from "react";
import { Route, DefaultRoute, NotFoundRoute, Redirect } from "react-router";
import Application from "./containers/Application";
import Lobby from "./containers/Lobby";
import Game from "./containers/Game";
import Admin from "./containers/Admin";
import About from "./containers/About";
import NotFound from "./containers/NotFound";
export default (
    <Route name="app" handler={Application} path="/">
        <DefaultRoute name="home" handler={Lobby} />

        <Route name="game" path="game/:gameId" handler={Game} />
        <Route name="admin" handler={Admin} />
        <Route name="about" handler={About} />
        <NotFoundRoute name="not-found" handler={NotFound} />
    </Route>
);
