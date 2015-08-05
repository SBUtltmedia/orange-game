import React, { PropTypes, Component } from 'react';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import _ from 'lodash';
import { MAX_PLAYERS, GAME_STATES } from '../constants/Settings';
import { Link } from 'react-router';
import { joinGame, leaveGame } from '../actions/LobbyActions';
import { startGame, deleteGame } from '../actions/AdminActions';
import { authId } from '../model';
import Griddle from 'griddle-react';

const { NOT_STARTED, STARTED, FINISHED } = GAME_STATES;

const styles = {
    container: {
        height: '90%'
    },
};

class AdminActionsComponent extends Component {
    render() {
        const { game } = this.props.data;
        return <div>
            { game.state === STARTED ?
                <a style={styles.link} onClick={() => console.log('Not implemented')}>
                    End game
                </a> :
                <a style={styles.link} onClick={() => startGame(game.gameId)}>
                    Start game
                </a>
            }
            <a style={styles.link} onClick={() => deleteGame(game.gameId)}>
                Delete game
            </a>
        </div>;
    }
}

class PlayerActionsComponent extends Component {
    render() {
        const { game } = this.props.data;
        if (game.state === STARTED) {
            return <div></div>;
        }
        else {
            return <div>
                <a style={styles.link} onClick={() => joinGame(game.gameId)}>
                    Join game
                </a>
                <a style={styles.link} onClick={() => leaveGame(game.gameId)}>
                    Leave game
                </a>
            </div>;
        }
    }
}

const ADMIN_COL_META = [{
    "columnName": "Actions",
    "customComponent": AdminActionsComponent
}];

const PLAYER_COL_META = [{
    "columnName": "Actions",
    "customComponent": PlayerActionsComponent
}];

export default class LobbyGames extends Component {
    static propTypes = {
        isAdmin: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            games: []
        };
    }

    gotoGameIfJoinedAndStarted(props) {
        const { isAdmin } = props;
        const { games } = this.state;
        if (!isAdmin) {
            const haveJoinedStartedGame = _.some(games, game => {
                const joinedGame = _.contains(_.keys(game.players), authId);
                return game.state === STARTED && joinedGame;
            });
            if (haveJoinedStartedGame) {
                window.location.href = `/?#/game/${game.gameId}`;
            }
        }
    }

    componentWillMount() {
        this.gotoGameIfJoinedAndStarted(this.props);
        this.firebaseRef = getFbRef('/games');
        subscribeToFirebaseList(this, this.firebaseRef, 'games', 'gameId');
    }

    componentWillReceiveProps(newProps) {
        this.gotoGameIfJoinedAndStarted(newProps);
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { isAdmin } = this.props;
        const { games } = this.state;
        const tableData = _.map(games, game => { return {
            Joined: game.players ? _.size(game.players),
            Players: _.map(game.players, p => p.name).join(', '),
            Actions: game
        }})
        return <div styles={[styles.container]}>
            <Griddle results={tableData}
                columnMetadata={ isAdmin ? ADMIN_COL_META : PLAYER_COL_META } />
        </div>;
    }
}
