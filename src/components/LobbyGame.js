import React, { PropTypes, Component } from 'react';

const styles = {
    container: {
        color: 'lightblue',
        backgroundColor: 'blue',
        marginTop: 16,
        display: 'flex'
    },
    info: {
        margin: 5
    }
};


export default class LobbyGame extends Component {
    static propTypes = {
        players: PropTypes.object.isRequired
    };

    render() {
        const { players } = this.props;
        return <div style={styles.container}>
            Game ({players} players)
        </div>;
    }
}
