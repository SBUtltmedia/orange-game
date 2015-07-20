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
        marginRight: 16
    }
};

@connect(state => ({
    userName: state.player.name,
    userId: state.player.userId
}))
export default class LobbyGames extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        userName: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired
    };

    render() {
        const { userName, playerId, userId } = this.props;
        return <div styles={styles.container}>
            <div styles={styles.section}>Player name: {userName}</div>
            <div styles={styles.section}>userId: {userId}</div>
        </div>;
    }
}
