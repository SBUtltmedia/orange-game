import React, { PropTypes, Component } from 'react';
import { connect } from 'redux/react';
import { getThisUser } from '../gameUtils';

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
    firebase: state.firebase
}))
export default class LobbyUserName extends Component {

    render() {
        const { firebase } = this.props;

        console.log(firebase);

        const player = getThisUser(firebase);

        console.log(player);

        if (player) {
            return <div styles={styles.container}>
                <div styles={styles.section}>Player name: {player.name}</div>
            </div>;
        }
        else {
            return <div styles={styles.container}></div>;  // fallback
        }
    }
}
