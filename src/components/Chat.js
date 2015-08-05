import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import model from '../model';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgray',
      width: 350
  }
};

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }

    componentWillMount() {
        const { gameId } = model;
        const url = `/games/${gameId}/chat`;
        this.firebaseRef = getFbRef(url);
        //subscribeToFirebaseObject(this, this.firebaseRef, 'stats');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        return <div style={styles.container}>
            Chat
        </div>;
    }
}
