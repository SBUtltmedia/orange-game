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
import { getFbRef, subscribeToFbObject } from '../utils';
import { NOT_STARTED, STARTED, FINISHED } from '../constants/GameStates';
import * as FluxActions from '../actions/FluxActions';
import { bindActionCreators } from 'redux';
import model from '../model';
import _ from 'lodash';
import { connect } from 'redux/react';

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
@connect(state => ({
    players: state.players
}))
export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            game: null,
            player: null
        };
    }

    onGameUpdate(game) {
        model.gameDay = game.day;
        if (game.state === FINISHED) {
            window.location.href = '/?#/gameOver/';
        }
    }

    onPlayerUpdate(player) {
        model.setPlayerData(player);
    }

    componentWillMount() {
        const { params, dispatch } = this.props;
        const fluxActions = bindActionCreators(FluxActions, dispatch);
        fluxActions.listenToFirebase();
        model.gameId = params.gameId;
        gameLoad(params.gameId);
        this.firebaseGameRef = getFbRef(`/games/${model.gameId}`);
        this.firebasePlayerRef = getFbRef(`/games/${model.gameId}/players/${model.authId}`);
        subscribeToFbObject(this, this.firebaseGameRef, 'game', (g) => this.onGameUpdate(g));
        subscribeToFbObject(this, this.firebasePlayerRef, 'player', (p) => this.onPlayerUpdate(p));
    }

    componentWillUnmount() {
        this.firebaseGameRef.off();
    }

    render() {

        console.log(this.props, this.state);

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
