import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Player from './Player';
import _ from 'lodash';
import { connect } from 'redux/react';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';
import { subscribeToFirebaseList } from '../utils';

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        overflow: 'scroll'
    }
};

@connect(state => ({
    userId: state.player.userId
}))
export default class Players extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    componentWillMount() {
        this.firebaseRef = new Firebase(`${FIREBASE_APP_URL}/players`);
        subscribeToFirebaseList(this.firebaseRef, {
            itemsLoaded: items => {
                this.setState({
                    players: _.values(items)
                });
            },
            itemAdded: item => {
                this.setState({
                    players: players.concat([item])
                });
            }
        });
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { players } = this.state;
        return <div style={styles.container}>
            { _.map(players, (p, i) => <Player key={i} {...p} />) }
        </div>;
    }
}
