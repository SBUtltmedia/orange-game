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
        //overflowY: 'scroll',
        width: 600
    }
};

class CreditComponent extends Component {
    render() {
        const value = this.props.data;
        const color = () => {
            if (value > 0) {
                return 'darkgreen';
            }
            else if (value < 0) {
                return 'red';
            }
            else {
                return 'black';
            }
        }();
        return <div style={{color: color}}>{value}</div>;
    }
}

class ReputationComponent extends Component {
    render() {
        return <img src="/images/emoticons/dont_care.png" />;
    }
}

class LoanComponent extends Component {
    render() {
        return <button>Offer</button>;
    }
}

const COL_META = [
    {
        "columnName": "Credit",
        "customComponent": CreditComponent
    },
    {
        "columnName": "Reputation",
        "customComponent": ReputationComponent
    },
    {
        "columnName": "Loan",
        "customComponent": LoanComponent
    }
];

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
            Credit: -5,
            Reputation: player.oranges.reputation,
            Loan: player
        }})
        return <div styles={[styles.container]}>
            <Griddle results={tableData}
                columns={[ 'Name', 'Fitness', 'Box', 'Basket', 'Dish', 'Credit', 'Reputation', 'Loan' ]}
                showPager={false} resultsPerPage={99} useFixedLayout={false}
                tableClassName='little-griddle'
                columnMetadata={ COL_META } />
        </div>;
    }
}
