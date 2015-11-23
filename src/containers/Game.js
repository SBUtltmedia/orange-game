import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import Controls from '../components/Controls';
import Box from '../components/Box';
import Basket from '../components/Basket';
import Dish from '../components/Dish';
import Stats from '../components/Stats';
import Players from '../components/Players';
import Chat from '../components/Chat';
import Death from '../components/Death';
import { areaTheme } from '../styles/Themes';
import { dealNewDayIfNeeded } from '../actions/GameActions';
import * as FluxActions from '../actions/FluxActions';
import { bindActionCreators } from 'redux';
import { isThisGameFinished } from '../gameUtils';
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
    firebase: state.firebase
}))
export default class Game extends Component {

    componentWillMount() {
        const { params, dispatch, firebase } = this.props;
        this.fluxActions = bindActionCreators(FluxActions, dispatch);
        this.fluxActions.listenToFirebase();
        model.gameId = params.gameId;
    }

    componentWillUnmount() {
        this.fluxActions.disconnectFromFirebase();
    }

    componentWillReceiveProps(newProps) {
        const { params, firebase } = newProps;
        const { games } = firebase;
        if (games) {
            const game = games[params.gameId];
            if (game) {
                if (isThisGameFinished(firebase)) {
                    window.location.href = `?#/game-over/${params.gameId}`;
                    return;
                }
            }
            else {
                window.location.href = '/';
                return;
            }

        }
        if (firebase) {
            dealNewDayIfNeeded(firebase);
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
            <Death />
        </div>;
    }
}
