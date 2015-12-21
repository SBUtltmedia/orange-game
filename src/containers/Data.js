import React, { Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';
import { connect } from 'redux/react';
import * as FluxActions from '../actions/FluxActions';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getGameCsv } from '../dataUtils';
import { getAllGames } from '../gameUtils';
import DownloadButton from 'downloadbutton';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        height: '100%'
    }
});

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

    makeFile(gameId, callback) {
        console.log("gameId", gameId);
        const { firebase } = this.props;
        getGameCsv(firebase, gameId, (error, csv) => {
            if (error) {
                console.error(error);
            }
            else {
                console.log(csv);
            }
            callback({
                mimetype: 'text/csv',
                filename: 'orange-game_data.csv',
                contents: csv
            });
        });
    }

    renderGame(id) {
        const { firebase } = this.props;
        return <div>
            {id}:&nbsp;
            <DownloadButton genFile={f => this.makeFile(id, f)} async={true} />
        </div>;
    }

    render() {
        const { firebase } = this.props;
        return <div styles={[styles.page]}>
            { _.map(getAllGames(firebase), game => this.renderGame(game.id))}
        </div>;
    }
}
