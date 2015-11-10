import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { MAX_PLAYERS } from '../constants/Settings';
import { joinGame, leaveGame } from '../actions/LobbyActions';
import { startGame, deleteGame } from '../actions/AdminActions';
import { isGameStarted, isGameFinished, getAllGames } from '../gameUtils';
import { authId } from '../model';
import Griddle from 'griddle-react';
import { connect } from 'redux/react';

const styles = {
    container: {
        width: '90%',
        margin: 'auto'
    },
};

function getGameState(appData, game) {
    if (isGameStarted(appData, game.id)) {
        if (isGameFinished(appData, game.id)) {
            return "Finished";
        }
        else {
            return "Running";
        }
    }
    else {
        return "Not Started";
    }
}

function renderAction(text, f) {
    return <a onClick={f}>{text}</a>;
}

class AdminActionsComponent extends Component {
    render() {
        const { game, firebase } = this.props.data;
        const state = getGameState(firebase, game);
        if (state === 'Running') {
            return <div>
                { renderAction('End game', () => console.log('Not implemented')) },&nbsp;
                { renderAction('View stats', () => console.log('Not implemented')) },&nbsp;
                { renderAction('Delete game', () => deleteGame(game.id)) }
            </div>;
        }
        else if (state === 'Not Started') {
            return <div>
                { renderAction('Start game', () => startGame(game.id)) },&nbsp;
                { renderAction('Delete game', () => deleteGame(game.id)) }
            </div>;
        }
        else if (state === 'Finished') {
            return <div>
                { renderAction('View stats', () => console.log('Not implemented')) },&nbsp;
                { renderAction('Delete game', () => deleteGame(game.id)) }
            </div>;
        }
    }
}

class PlayerActionsComponent extends Component {
    render() {
        const { game, firebase } = this.props.data;
        if (isGameStarted(firebase, game.id)) {
            return <div></div>;
        }
        else {
            return <div>
                { renderAction('Join game', () => joinGame(game.id, firebase)) },&nbsp;
                { renderAction('Leave game', () => leaveGame(game.id)) }
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

@connect(state => ({
    firebase: state.firebase
}))
export default class LobbyGames extends Component {
    static propTypes = {
        isAdmin: PropTypes.bool
    };

    render() {
        const { isAdmin, firebase } = this.props;
        if (firebase) {
            const games = getAllGames(firebase);
            const tableData = _.map(games, (game, gameId) => { return {
                Joined: _.size(game.players),
                Players: _.map(game.players, p => p.name).join(', '),
                State: getGameState(firebase, game),
                Actions: {
                    game: _.extend({ gameId: gameId }, game),
                    firebase: firebase
                }
            }});
            return <div styles={[styles.container]}>
                <Griddle results={tableData}
                    columns={[ 'Joined', 'Players', 'State', 'Actions' ]}
                    showPager={false} resultsPerPage={999} useFixedLayout={false}
                    tableClassName='big-griddle'
                    columnMetadata={ isAdmin ? ADMIN_COL_META : PLAYER_COL_META } />
            </div>;
        }
        return <div styles={[styles.container]}></div>;  // fallback
    }
}
