import React from "react";
import Router from 'react-router';
import routes from "./routes";
import { APP_ROOT_ELEMENT } from './constants/Settings';
import model from './model';
import { getAuth, getFbRef } from './utils';

const mountNode = document.getElementById(APP_ROOT_ELEMENT);

const auth = getAuth();
if (auth) {
    model.authId = auth.uid;
    //AppActions.getUserData(auth.uid);
}
else {
    const ref = getFbRef('/');
    ref.authAnonymously((error, authData) => {
        if (authData) {
            model.authId = authData.uid;
        }
        else {
            console.error("Client unauthenticated.");
        }
    });
}

console.log(model);

Router.run(routes, function (Handler, state) {
    React.render(<Handler/>, mountNode);
});
