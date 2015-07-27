import React, { PropTypes, Component } from 'react';
import model from '../model';

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

export default class LobbyGames extends Component {

    render() {
        const { userName, authId } = model;
        return <div styles={styles.container}>
            <div styles={styles.section}>Player name: {userName}</div>
            <div styles={styles.section}>authId: {authId}</div>
        </div>;
    }
}
