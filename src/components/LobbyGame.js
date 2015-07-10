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
        game: PropTypes.object.isRequired
    };

    render() {
        const { game } = this.props;
        const { id, players } = game;

        console.log(game);

        return <div style={styles.container}>
            <div style={styles.section}>{id}</div>
            <div style={styles.section}>({players.length}&nbsp;players)</div>
            <div style={styles.section}>
                <Link to="game" query={{id: id}}>Join game</Link>
            </div>
        </div>;
    }
}
