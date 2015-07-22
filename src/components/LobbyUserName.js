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
    userName: state.user.name,
    authId: state.user.authId
}))
export default class LobbyGames extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        userName: PropTypes.string.isRequired,
        authId: PropTypes.string.isRequired
    };

    render() {
        const { userName, authId } = this.props;
        return <div styles={styles.container}>
            <div styles={styles.section}>Player name: {userName}</div>
            <div styles={styles.section}>authId: {authId}</div>
        </div>;
    }
}
