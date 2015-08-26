import React, { PropTypes, Component } from 'react';
import { userName, authId } from '../model';

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

export default class LobbyUserName extends Component {

    render() {
        return <div styles={styles.container}>
            <div styles={styles.section}>Player name: {userName}</div>
        </div>;
    }
}
