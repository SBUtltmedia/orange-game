import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import _ from 'lodash';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import model from '../model';
import Griddle from 'griddle-react';

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        overflow: 'scroll'
    }
};

class ReputationComponent extends Component {
    render() {
        return <img src="/images/emoticons/dont_care.png" />;
    }
}

const COL_META = [{
    "columnName": "Reputation",
    "customComponent": ReputationComponent
}];

export default class Players extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    componentWillMount() {
        this.firebaseRef = getFbRef(`/games/${model.gameId}/players`);
        subscribeToFirebaseList(this, this.firebaseRef, 'players', 'authId');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { players } = this.state;
        const tableData = _.map(players, player => { return {
            Name: player.name,
            Fitness: player.fitness,
            Box: player.oranges.box,
            Basket: player.oranges.basket,
            Dish: player.oranges.dish,
            Reputation: player.oranges.reputation
        }})
        return <div styles={[styles.container]}>
            <Griddle results={tableData}
                columns={[ 'Name', 'Fitness', 'Box', 'Basket', 'Dish', 'Reputation' ]}
                showPager={false} resultsPerPage={99}
                columnMetadata={ COL_META } />
        </div>;
    }
}
