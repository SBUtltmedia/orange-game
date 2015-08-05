import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import model from '../model';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgray',
      width: 300,
      position: 'relative'
  },
  input: {
      position: 'absolute',
      bottom: 0,
      width: '100%'
  },
  textBox: {
      width: 200,
      margin: 'auto'
  },
  presets: {
      marginTop: 10
  },
  preset: {
      fontSize: 10
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
            <form style={styles.input}>
                <input style={styles.textBox} />
                <input type="submit" value="Send" />
                <div style={styles.presets}>
                    <button style={styles.preset}>Can I borrow oranges?</button>
                    <button style={styles.preset}>I have oranges to borrow.</button>
                </div>
            </form>
        </div>;
    }
}
