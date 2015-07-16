import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';
import { LINK_COLOR } from '../styles/Themes';
import _ from 'lodash';

const styles = {
    container: {
        color: 'black',
        backgroundColor: 'lightgray',
        marginTop: 16,
    },
    row: {
        display: 'flex'
    },
    section: {
        margin: 10
    },
    link: {
        color: LINK_COLOR
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
            <div style={styles.row}>
                <div style={styles.section}>{id}</div>
                <div style={styles.section}>
                    ({_.size(players)}&nbsp;players)
                </div>
                <div style={styles.section}>
                    <a style={styles.link} onClick={this.joinGame.bind(this)}>
                        Join game
                    </a>
                    {/* <Link to="game" query={{id: id}}>Join game</Link> */}
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
