import React, { Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';
import { connect } from 'redux/react';
import * as FluxActions from '../actions/FluxActions';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getAllGamesCsv } from '../dataUtils';
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

    makeFile(callback) {
        const { firebase } = this.props;
        getAllGamesCsv(firebase, (error, csv) => {
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

    render() {
        return <div styles={[styles.page]}>
            <DownloadButton genFile={this.makeFile.bind(this)} async={true} />
        </div>;
    }
}
