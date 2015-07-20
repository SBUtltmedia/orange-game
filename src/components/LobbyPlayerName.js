import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';

const styles = {
    container: {
        color: 'white',
        backgroundColor: 'darkgray',
        display: 'flex'
    },
    section: {
        marginLeft: 10,
        marginRight: 20
    }
};

@connect(state => ({
    playerName: state.player.name,
    playerId: state.player.playerId,
    userId: state.player.userId
}))
export default class LobbyGames extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        playerName: PropTypes.string.isRequired
    };

    render() {
        const { playerName, playerId, userId } = this.props;
        return <div styles={styles.container}>
            <div styles={styles.section}>Player name: {playerName}</div>
            <div styles={styles.section}>playerId: {playerId}</div>
            <div styles={styles.section}>userId: {userId}</div>
        </div>;
    }
}
