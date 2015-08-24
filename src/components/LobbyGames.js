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
    return <a onClick={f}>{text}</a>;
}

class AdminActionsComponent extends Component {
    render() {
        const { game } = this.props.data;
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
        const { game, firebase } = this.props.data;
        if (game.state === STARTED) {
            return <div></div>;
        }
        else {
            return <div>
                { renderAction('Join game', () => joinGame(game.gameId, firebase)) },&nbsp;
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
    firebase: state.firebase
}))
export default class LobbyGames extends Component {
    static propTypes = {
        isAdmin: PropTypes.bool
    };

    render() {
        const { isAdmin, firebase } = this.props;
        if (firebase) {
            const { games } = firebase;
            const tableData = _.map(games, (game, gameId) => { return {
                Joined: _.size(game.players),
                Players: _.map(game.players, p => p.name).join(', '),
                Actions: {
                    game: _.extend({ gameId: gameId }, game),
                    firebase: firebase
                }
            }});
            return <div styles={[styles.container]}>
                <Griddle results={tableData}
                    columns={[ 'Joined', 'Players', 'Actions' ]}
                    showPager={false} resultsPerPage={99} useFixedLayout={false}
                    tableClassName='big-griddle'
                    columnMetadata={ isAdmin ? ADMIN_COL_META : PLAYER_COL_META } />
            </div>;
        }
        return <div styles={[styles.container]}></div>;  // fallback
    }
}
