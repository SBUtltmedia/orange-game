import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Player from './Player';
import _ from 'lodash';
import { connect } from 'redux/react';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

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
        const { userId } = this.props;
        this.firebaseRef = new Firebase(FIREBASE_APP_URL + '/players');
        this.amOnline = new Firebase(`${FIREBASE_APP_URL}/.info/connected`);
        this.userRef = new Firebase(`${FIREBASE_APP_URL}/presence/${userId}`);
        this.firebaseRef.on("child_added", function(dataSnapshot) {
            this.setState({
                players: this.state.players.concat([dataSnapshot.val()])
            });
        }.bind(this));

        this.amOnline.on('value', function(online) {
            if (online.val()) {
                //this.userRef.onDisconnect().remove();
                this.userRef.set(true);

                const player = { name: '' + userId, online: true };
                this.setState({
                    players: this.state.players.concat([player])
                });

                this.firebaseRef.push(player);
            }
            else {
                const players = this.state.players;
            }
        }.bind(this));
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { players } = this.state;
        return <div style={styles.container}>
            { players.map((p, i) => <Player key={i} name={p.name} />) }
        </div>
    }
}
