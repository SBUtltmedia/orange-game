import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import ItemTypes from '../constants/ItemTypes';
import { connect } from 'redux/react';
import { areaTheme } from '../styles/Themes';

import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

const styles = {
    container: {
      ...areaTheme
    }
}

@connect(state => ({
    oranges: state.game.oranges.basket,
    userId: state.player.userId
}))
export default class Basket{
  static propTypes = {
    oranges: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
      const { userId } = this.props;
      console.log("Props changed", nextProps);
      this.firebaseRef.child('').update()
  }

  componentWillMount() {
      this.firebaseRef = new Firebase(`${FIREBASE_APP_URL}/players`);
  }

  componentWillUnmount() {
      this.firebaseRef.off();
  }

  render() {
    const { actions, oranges } = this.props;
    return <Bin actions={actions} style={styles.container}
                textual={true} graphical={true}
                name="Basket" label="Oranges saved" oranges={oranges} />
  }
}
