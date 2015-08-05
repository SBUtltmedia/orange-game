import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import Controls from '../components/Controls';
import OrangeBox from '../components/OrangeBox';
import Basket from '../components/Basket';
import Dish from '../components/Dish';
import Stats from '../components/Stats';
import Players from '../components/Players';
import Chat from '../components/Chat';
import { areaTheme } from '../styles/Themes';
import { gameLoad } from '../actions/GameActions';
import { getFbRef, subscribeToFirebaseObject } from '../utils';
import { GAME_STATES } from '../constants/Settings';
import model from '../model';
import _ from 'lodash';

const { NOT_STARTED, STARTED, FINISHED } = GAME_STATES;

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

@DragDropContext(HTML5Backend)
export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameState: NOT_STARTED
        };
    }

    componentWillMount() {
        const { params } = this.props;
        model.gameId = params.gameId;
        gameLoad(params.gameId);
        const url = `/games/${model.gameId}/state`;
        this.firebaseRef = getFbRef(url);
        subscribeToFirebaseObject(this, this.firebaseRef, 'gameState');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    componentWillReceiveProps(newProps) {
        if (state.gameState === FINISHED) {
            window.location.href = '/?#/gameOver/';
        }
    }

    render() {
        return <div style={styles.container}>
            <div style={styles.row}>
                <Basket />
                <Controls />
                <Dish />
            </div>
            <div style={styles.row}>
                <Stats />
                <Players />
                <Chat />
            </div>
        </div>;
    }
}
