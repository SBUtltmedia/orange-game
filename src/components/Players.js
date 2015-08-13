import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import _ from 'lodash';
import { subscribeToFbList, getFbRef } from '../utils';
import { openAskNegotiation, openOfferNegotiation } from '../actions/MarketActions';
import model from '../model';
import Griddle from 'griddle-react';
import Negotiation from '../components/Negotiation';

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        //overflowY: 'scroll',
        width: 600
    },
    checkmark: {
        width: 16,
        height: 16
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
        return <img src={require("../../images/emoticons/dont_care.png")} />;
    }
}

class LoanComponent extends Component {
    render() {
        const player = this.props.data;
        if (player && player.oranges) {
            return <div>
                <button onClick={() => openAskNegotiation(player)}>Ask</button>
                <button onClick={() => openOfferNegotiation(player)}>Offer</button>
            </div>;
        }
        else {
            return <div></div>;
        }
    }
}

class ReadyComponent extends Component {
    render() {
        const player = this.props.data;
        if (player) {
            return <img style={styles.checkmark}
                    src={require("../../images/checkmark.png")} />;
        }
        else {
            return <div></div>;
        }
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
    },
    {
        "columnName": "Ready",
        "customComponent": ReadyComponent
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
        subscribeToFbList(this, this.firebaseRef, 'players', 'authId');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { players } = this.state;
        const tableData = _.map(players, player => {
            if (player.oranges) {
                return {
                    Name: player.name,
                    Fitness: player.fitness,
                    Box: player.oranges.box,
                    Basket: player.oranges.basket,
                    Dish: player.oranges.dish,
                    Credit: -5,
                    Reputation: player.reputation,
                    Loan: player,
                    Ready: player
                };
            }
            else {
                return {
                    Name: player.name
                };
            }
        })
        return <div styles={[styles.container]}>
            <Griddle results={tableData}
                columns={[ 'Name', 'Fitness', 'Box', 'Basket', 'Dish', 'Credit',
                            'Reputation', 'Loan', 'Ready' ]}
                showPager={false} resultsPerPage={99} useFixedLayout={false}
                tableClassName='little-griddle'
                columnMetadata={ COL_META } />
            <Negotiation />
        </div>;
    }
}
