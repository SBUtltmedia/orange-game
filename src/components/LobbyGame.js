import React, { PropTypes, Component } from 'react';
import { MAX_PLAYERS, GAME_STATES } from '../constants/Settings';
import { Link } from 'react-router';
import _ from 'lodash';
import { joinGame, leaveGame } from '../actions/LobbyActions';
import { startGame, deleteGame } from '../actions/AdminActions';
import { authId } from '../model';

const { NOT_STARTED, STARTED, FINISHED } = GAME_STATES;

const BACKGROUND_COLORS = {
    NOT_STARTED: 'lightgray',
    STARTED: 'lightblue',
    FINISHED: 'pink'
}

const styles = {
    container: {
        color: 'black',
        marginTop: 16,
    },
    row: {
        display: 'flex'
    },
    section: {
        margin: 10
    },
    link: {
        margin: 10
    }
};

function gotoGameIfJoinedAndStarted(props) {
    const { game } = props;
    const joinedGame = _.contains(_.keys(game.players), authId);
    if (game.state === STARTED && joinedGame) {
        window.location.href = `/?#/game/${game.gameId}`;
    }
}

export default class LobbyGame extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        isAdmin: PropTypes.bool
    };

    componentWillMount() {
        gotoGameIfJoinedAndStarted(this.props);
    }

    componentWillReceiveProps(newProps) {
        gotoGameIfJoinedAndStarted(newProps);
    }

    renderUserButtons() {
        const { game } = this.props;
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

    renderAdminButtons() {
        const { game } = this.props;
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

    render() {
        const { game, isAdmin } = this.props;
        const { gameId, players, state } = game;
        const backgroundColor = BACKGROUND_COLORS[state];
        return <div style={{ ...styles.container, backgroundColor }}>
            <div style={styles.row}>
                <div style={styles.section}>{gameId}</div>
                <div style={styles.section}>
                    ({_.size(players)}&nbsp;players)
                </div>
                <div style={styles.section}>
                    { isAdmin ? this.renderAdminButtons() : this.renderUserButtons() }
                </div>
            </div>
            <div style={styles.row}>
                <div style={styles.section}>
                    Players joined:&nbsp;
                    { _.map(players, p => p.name).join(', ') }
                </div>
                <div style={styles.section}>
                    <Link to={`/game/${game.gameId}`}>Goto</Link> (for testing)
                </div>
            </div>
        </div>;
    }
}
