import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'redux/react';
import _ from 'lodash';

const styles = {
    container: {
        height: '90%'
    },
};

@connect(state => ({
    games: state.lobby.games,
    playerName: state.player.name
}))
export default class LobbyGames extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        games: PropTypes.array.isRequired
    };

    render() {
        const { games, actions } = this.props;
        return <div styles={[styles.container]}>
            { _.map(games, (g, i) => <LobbyGame game={g} key={i} />) }
        </div>;
    }
}
