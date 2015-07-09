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
        margin: 5
    }
};

export default class LobbyGame extends Component {
    static propTypes = {
        players: PropTypes.object.isRequired
    };

    render() {
        const { players } = this.props;
        return <div style={styles.container}>
            <div style={styles.section}>Game ({players.length}&nbsp;players)</div>
            <div style={styles.section}>
                <Link to="game">Join game</Link>
            </div>
        </div>;
    }
}
