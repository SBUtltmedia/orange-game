import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';
import { LINK_COLOR } from '../styles/Themes';
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

@connect(state => ({
    userId: state.player.userId,
    userName: state.player.name
}))
export default class LobbyGame extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool
    };

    componentWillReceiveProps(newProps) {
        //if (newProps.)
    }

    joinGame() {
        const { game, userId, userName, actions } = this.props;
        actions.joinGame(game.id, userId, userName);
    }

    leaveGame() {
        const { game, userId, actions } = this.props;
        actions.leaveGame(game.id, userId);
    }

    startGame() {
        const { game, actions } = this.props;
        actions.startGame(game.id);
    }

    deleteGame() {
        const { game, actions } = this.props;
        actions.deleteGame(game.id);
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
        const { id, players, started } = game;
        const backgroundColor = started ? 'lightblue' : 'lightgray';
        return <div style={{ ...styles.container, backgroundColor }}>
            <div style={styles.row}>
                <div style={styles.section}>{id}</div>
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
            </div>
        </div>;
    }
}
