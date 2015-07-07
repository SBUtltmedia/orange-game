import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Player from './Player';
import _ from 'lodash';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

var userId = Math.ceil(Math.random() * 99999999999999);
var amOnline = new Firebase(`${FIREBASE_APP_URL}/.info/connected`);
var userRef = new Firebase(`${FIREBASE_APP_URL}/presence/${userId}`);

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        overflow: 'scroll'
    }
};

export default class Players extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            me: { name: '' + userId }
        };
    }

    componentWillMount() {
        this.firebaseRef = new Firebase(FIREBASE_APP_URL + '/players');
        this.firebaseRef.on("child_added", function(dataSnapshot) {
            this.setState({
                players: this.state.players.concat([dataSnapshot.val()])
            });
        }.bind(this));

        amOnline.on('value', function(online) {
            if (online.val()) {
                //userRef.onDisconnect().remove();
                userRef.set(true);

                const player = { name: '' + userId, online: true };
                this.setState({
                    players: this.state.players.concat([player])
                });

                this.firebaseRef.push(player);
            }
            else {
                const players = this.state.players;
                const me = _.findWhere(players, { name: this.state.me.name });

                if (me) {
                    me.online = false;
                    this.setState({
                        players: players
                    });
                }
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
