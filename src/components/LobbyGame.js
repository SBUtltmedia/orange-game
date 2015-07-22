import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';
import { LINK_COLOR } from '../styles/Themes';
import { Link } from 'react-router';
import _ from 'lodash';

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
        color: LINK_COLOR,
        margin: 10
    }
};

function gotoGameIfJoinedAndStarted(props) {
    const { game, authId } = props;
    const joinedGame = _.some(game.players, p => {
        return p.authId === authId;
    });
    if (game.started && joinedGame) {
        window.location.href = `/?#/game/${game.gameId}`;
    }
}

@connect(state => ({
    authId: state.user.authId,
    userName: state.user.name
}))
export default class LobbyGame extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        authId: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool
    };

    componentWillMount() {
        gotoGameIfJoinedAndStarted(this.props);
    }

    componentWillReceiveProps(newProps) {
        gotoGameIfJoinedAndStarted(newProps);
    }

    joinGame() {
        const { game, authId, userName, actions } = this.props;
        actions.joinGame(game.gameId, authId, userName);
    }

    leaveGame() {
        const { game, authId, actions } = this.props;
        actions.leaveGame(game.gameId, authId);
    }

    startGame() {
        const { game, actions } = this.props;
        actions.startGame(game.gameId);
    }

    deleteGame() {
        const { game, actions } = this.props;
        actions.deleteGame(game.gameId);
    }

    renderUserButtons() {
        return <div>
            <a style={styles.link} onClick={this.joinGame.bind(this)}>
                Join game
            </a>
            <a style={styles.link} onClick={this.leaveGame.bind(this)}>
                Leave game
            </a>
        </div>;
    }

    renderAdminButtons() {
        return <div>
            <a style={styles.link} onClick={this.startGame.bind(this)}>
                Start game
            </a>
            <a style={styles.link} onClick={this.deleteGame.bind(this)}>
                Delete game
            </a>
        </div>;
    }

    render() {
        const { game, isAdmin } = this.props;
        const { gameId, players, started } = game;
        const backgroundColor = started ? 'lightblue' : 'lightgray';
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
                    <Link to={`/game/${game.gameId}`}>Goto</Link>
                </div>
            </div>
        </div>;
    }
}
