import React from "react";
import Router from 'react-router';
import routes from "./routes";
import { APP_ROOT_ELEMENT } from './constants/Settings';
import model from './model';
import { getAuth, getFbRef, getFbObject } from './utils';

const mountNode = document.getElementById(APP_ROOT_ELEMENT);

function authUser() {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        if (auth) {
            model.authId = auth.uid;
            getFbObject(`/users/${model.authId}`, user => {
                if (user && user.name) {
                    model.userName = user.name;
                    resolve();
                }
            });
        }
        else {
            const ref = getFbRef('/');
            ref.authAnonymously((error, authData) => {
                if (authData) {
                    model.authId = authData.uid;
                    resolve();
                }
                else {
                    console.error("Client unauthenticated.");
                    reject();
                }
            });
        }
    });
}

authUser().then(() => {
    Router.run(routes, function (Handler, state) {
        React.render(<Handler/>, mountNode);
    });
});
