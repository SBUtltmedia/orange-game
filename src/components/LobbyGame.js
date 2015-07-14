import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';

const styles = {
    container: {
        color: 'white',
        backgroundColor: 'red',
        marginTop: 16,
        display: 'flex'
    },
    section: {
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
        userName: PropTypes.string.isRequired
    };

    joinGame() {
        const { game, userId, userName, actions } = this.props;
        actions.joinGame(game.id, userId, userName);
    }

    render() {
        const { game } = this.props;
        const { id, players } = game;
        return <div style={styles.container}>
            <div style={styles.section}>{id}</div>
            <div style={styles.section}>
                ({(players || []).length}&nbsp;players)
            </div>
            <div style={styles.section}>
                <a onClick={this.joinGame.bind(this)}>Join game</a>
                {/* <Link to="game" query={{id: id}}>Join game</Link> */}
            </div>
        </div>;
    }
}
