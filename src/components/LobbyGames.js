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

function renderAction(text, f) {
    return <a style={styles.link} onClick={f}>{text}</a>;
}

class AdminActionsComponent extends Component {
    render() {
        const game = this.props.data;
        if (game.state === STARTED) {
            return <div>
                { renderAction('End game', () => console.log('Not implemented')) },&nbsp;
                { renderAction('View stats', () => console.log('Not implemented')) },&nbsp;
                { renderAction('Delete game', () => deleteGame(game.gameId)) }
            </div>;
        }
        else {
            return <div>
                { renderAction('Start game', () => startGame(game.gameId)) },&nbsp;
                { renderAction('Delete game', () => deleteGame(game.gameId)) }
            </div>;
        }
    }
}

class PlayerActionsComponent extends Component {
    render() {
        const game = this.props.data;
        if (game.state === STARTED) {
            return <div></div>;
        }
        else {
            return <div>
                { renderAction('Join game', () => joinGame(game.gameId)) },&nbsp;
                { renderAction('Leave game', () => leaveGame(game.gameId)) }
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
            Joined: _.size(game.players),
            Players: _.map(game.players, p => p.name).join(', '),
            Actions: game
        }})
        return <div styles={[styles.container]}>
            <Griddle results={tableData}
                columns={[ 'Joined', 'Players', 'Actions' ]}
                columnMetadata={ isAdmin ? ADMIN_COL_META : PLAYER_COL_META } />
        </div>;
    }
}
