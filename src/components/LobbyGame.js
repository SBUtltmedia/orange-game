import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

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

export default class LobbyGame extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    render() {
        const { game, userId, actions } = this.props;
        const { id, players } = game;
        return <div style={styles.container}>
            <div style={styles.section}>{id}</div>
            <div style={styles.section}>
                ({(players || []).length}&nbsp;players)
            </div>
            <div style={styles.section}>
                <a onclick={actions.joinGame(userId)}>Join game</a>
                {/* <Link to="game" query={{id: id}}>Join game</Link> */}
            </div>
        </div>;
    }
}
