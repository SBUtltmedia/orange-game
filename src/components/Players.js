import React, { PropTypes, Component } from 'react/addons';
import { areaTheme } from '../styles/Themes';
import Player from './Player';

import Rebase from 're-base';
import { FIREBASE_APP_URL } from '../constants/Settings';
const base = Rebase.createClass(FIREBASE_APP_URL + '/games');

var userId = 277;
var amOnline = new Firebase(`${FIREBASE_APP_URL}/.info/connected`);
var userRef = new Firebase(`${FIREBASE_APP_URL}/presence/${userId}`);

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
    }
};

export default class Players extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    componentWillMount() {
      /*
       * Here we call 'bindToState', which will update
       * our local 'messages' state whenever our 'chats'
       * Firebase endpoint changes.
       */
        this.ref = base.syncState('game', {
            context: this,
            state: 'players',
            asArray: true
        });
        amOnline.on('value', function(snapshot) {
            if (snapshot.val()) {
                userRef.onDisconnect().remove();
                userRef.set(true);

                const player = { name: 'Ken', userId: 300 };
                this.setState({
                    players: this.state.players.concat([player])
                });
            }
        }.bind(this));
    }

    componentWillUnmount(){
        base.removeBinding(this.ref);
    }

    render() {
        const { players } = this.state;
        return <div style={styles.container}>
            { players.map((p, i) => <Player key={i} name={p.name} />) }
        </div>
    }
}
