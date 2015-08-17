import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { MAX_PLAYERS } from '../constants/Settings';
import { NOT_STARTED, STARTED, FINISHED } from '../constants/GameStates';
import { Link } from 'react-router';
import { joinGame, leaveGame } from '../actions/LobbyActions';
import { startGame, deleteGame } from '../actions/AdminActions';
import { authId } from '../model';
import Griddle from 'griddle-react';
import { connect } from 'redux/react';

const styles = {
    container: {
        width: '90%',
        margin: 'auto'
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

@connect(state => ({
    games: state.firebase.games
}))
export default class LobbyGames extends Component {
    static propTypes = {
        isAdmin: PropTypes.bool
    };

    gotoGameIfJoinedAndStarted() {
        const { isAdmin, games } = this.props;
        if (!isAdmin) {
            const joinedGame = _.find(games, g => {
                return _.contains(_.keys(g.players), authId);
            });
            if (joinedGame && joinedGame.state === STARTED) {
                window.location.href = `/?#/game/${joinedGame.gameId}`;
            }
        }
    }

    render() {
        const { isAdmin, games } = this.props;

        console.log(games);

        const tableData = _.map(games, game => { return {
            Joined: _.size(game.players),
            Players: _.map(game.players, p => p.name).join(', '),
            Actions: game
        }})
        return <div styles={[styles.container]}>
            <Griddle results={tableData}
                columns={[ 'Joined', 'Players', 'Actions' ]}
                showPager={false} resultsPerPage={99} useFixedLayout={false}
                tableClassName='big-griddle'
                columnMetadata={ isAdmin ? ADMIN_COL_META : PLAYER_COL_META } />
        </div>;
    }
}
