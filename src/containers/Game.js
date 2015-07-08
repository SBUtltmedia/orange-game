import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd/modules/backends/HTML5';
import Controls from '../components/Controls';
import OrangeBox from '../components/OrangeBox';
import Basket from '../components/Basket';
import Dish from '../components/Dish';
import Stats from '../components/Stats';
import Players from '../components/Players';
import { areaTheme } from '../styles/Themes';
import { bindActionCreators } from 'redux';
import * as OrangeActions from '../actions/OrangeActions';
import { connect } from 'redux/react';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

const styles = {
  container: {
    backgroundColor: '#ffad00',
    color: '#000',
    height: "100%"
  },
  row: {
      display: "flex",
      height: areaTheme.height + areaTheme.margin
  }
};

@connect(state => ({}))
@DragDropContext(HTML5Backend)
export default class Game extends Component {
  
    onAuth(authData, x) {
        if (authData) {
          console.log("User newly authenticated " + auth.uid);
          this.actions.userAuthed(authData.uid);
        }
        else {
          console.error("Client unauthenticated.")
        }
    }

    componentWillMount() {
        const { dispatch } = this.props;
        this.actions = bindActionCreators(OrangeActions, dispatch);
        const ref = new Firebase(FIREBASE_APP_URL);

        const auth = ref.getAuth();
        if (auth) {  // if already authorized

            console.log("User already authenticated: " + auth.uid);
            this.actions.userAuthed(auth.uid);
        }
        else {
            ref.authAnonymously(this.onAuth);
        }
    }

    render() {
        return <div style={styles.container}>
          <div style={styles.row}>
              <Basket actions={this.actions} />
              <Controls actions={this.actions} />
              <Dish actions={this.actions} />
          </div>
          <div style={styles.row}>
              <Stats actions={this.actions} />
              <Players actions={this.actions} />
          </div>
        </div>;
    }
}
