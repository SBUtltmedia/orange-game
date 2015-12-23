import React, { Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';
import { connect } from 'redux/react';
import * as FluxActions from '../actions/FluxActions';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getGameCsv, getAllGamesCsv } from '../dataUtils';
import { getAllGames } from '../gameUtils';
import DownloadButton from 'downloadbutton';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        height: '100%'
    }
});

function onGottenCsv(error, csv, name, callback) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(csv);
        callback({
            mimetype: 'text/csv',
            filename: `orange-game_${name}.csv`,
            contents: csv
        });
    }
}

@connect(state => ({
    firebase: state.firebase
}))
export default class Data extends Component {
    componentWillMount() {
        const { dispatch, firebase } = this.props;
        this.fluxActions = bindActionCreators(FluxActions, dispatch);
        this.fluxActions.listenToFirebase();
    }

    componentWillUnmount() {
        this.fluxActions.disconnectFromFirebase();
    }

    makeGameFile(gameId, callback) {
        const { firebase } = this.props;
        getGameCsv(firebase, gameId, (error, csv) => onGottenCsv(error, csv, gameId.substring(1), callback));
    }

    makeAllGamesFile(callback) {
        const { firebase } = this.props;
        getAllGamesCsv(firebase, (error, csv) => onGottenCsv(error, csv, "all_games", callback));
    }

    renderGame(id) {
        const { firebase } = this.props;
        return <p>
            {id.substring(1)}:&nbsp;
            <DownloadButton genFile={f => this.makeGameFile(id, f)} async={true} />
        </p>;
    }

    render() {
        const { firebase } = this.props;
        return <div styles={[styles.page]}>
            <p>All games: <DownloadButton genFile={f => this.makeAllGamesFile(f)} async={true} /></p>
            { _.map(getAllGames(firebase), game => this.renderGame(game.id))}
        </div>;
    }
}
