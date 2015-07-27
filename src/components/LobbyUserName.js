import React, { PropTypes, Component } from 'react';
import { subscribeToFirebaseObject, getFbRef } from '../utils';
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

export default class LobbyUserName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                authId: model.authId,
                name: null
            }
        }
    }

    componentWillMount() {
        const { authId } = this.state.user;
        this.firebaseRef = getFbRef(`/users/${authId}`);
        subscribeToFirebaseObject(this, this.firebaseRef, 'user');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { name, authId } = this.state.user;
        return <div styles={styles.container}>
            <div styles={styles.section}>Player name: {name}</div>
        </div>;
    }
}
