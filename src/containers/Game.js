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
import { gameLoad, newDay } from '../actions/GameActions';
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
            game: null
        };
    }

    onFbUpdate() {
        const { game } = this.state;
        if (game) {
            if (game.state === FINISHED) {
                window.location.href = '/?#/gameOver/';
            }
            /*
            else if (_.every(game.players, p => p.ready)) {
                newDay();
            }
            */
        }
    }

    componentWillMount() {
        const { params } = this.props;
        model.gameId = params.gameId;
        gameLoad(params.gameId);
        this.firebaseRef = getFbRef(`/games/${model.gameId}`);
        const callback = () => this.onFbUpdate();
        subscribeToFirebaseObject(this, this.firebaseRef, 'game', callback);
    }

    componentWillUnmount() {
        this.firebaseRef.off();
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
