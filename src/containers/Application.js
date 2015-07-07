import React, { Component } from "react";
import StyleSheet from'react-style';
import { RouteHandler } from 'react-router';
import Menu from "../components/Menu";
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffad00'
    }
});

export default class Application extends Component {

    onAuth(authData, x) {

        console.log(authData, x);

        if (authData) {
          console.log("Authenticated with uid:", authData.uid);
        } else {
          console.log("Client unauthenticated.")
        }
    }

    componentWillMount() {
        const ref = new Firebase(FIREBASE_APP_URL);
        ref.onAuth(this.onAuth);
        ref.authAnonymously(alert);
    }

	render() {
        return <div style={styles.page}>
            <Menu />
            {/* TODO: Do we have to pass locations to RouteHandler? */}
            <RouteHandler {...this.props} />
        </div>
	}
}
