import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import _ from 'lodash';
import { openAskNegotiation, openOfferNegotiation } from '../actions/MarketActions';
import model from '../model';
import Griddle from 'griddle-react';
import Negotiation from '../components/Negotiation';
import { connect } from 'redux/react';
import { getThisGame, getPlayerTransactions } from '../gameUtils';

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
                return 'transparent';  // if zero just show nothing
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

function createButton(title, onClick, show) {
    if (show) {
        return <button onClick={onClick}>{title}</button>;
    }
    else {
        return <div></div>;
    }
}

function createAskButton(player, canAsk) {
    return createButton('Ask', () => openAskNegotiation(player), canAsk);
}

function createOfferButton(player, canOffer) {
    return createButton('Offer', () => openOfferNegotiation(player), canOffer);
}

class LoanComponent extends Component {
    render() {
        const player = this.props.data;
        if (player && player.oranges) {
            const isSelf = player.authId === model.authId;
            const canOffer = !isSelf && model.oranges.basket > 0;
            const canAsk = !isSelf && player.oranges.basket > 0;
            return <div>
                {createAskButton(player, canAsk)}
                {createOfferButton(player, canOffer)}
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
        if (player && player.day > model.gameDay) {
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

@connect(state => ({
    firebase: state.firebase
}))
export default class Players extends Component {

    calculateCredit(player) {
        const { firebase } = this.props;
        const game = getThisGame(firebase);
        if (game) {
            const transactions = getPlayerTransactions(firebase, player.authId);
            return _.reduce(transactions, (total, t) => {
                if (t.lender.authId === player.authId) {
                    return total + t.oranges.later;
                }
                else if (t.borrower.authId === player.authId) {
                    return total - t.oranges.later;
                }
            }, 0);
        }
    }

    render() {
        const { firebase } = this.props;
        const game = getThisGame(firebase);
        if (game) {
            const tableData = _.map(game.players, player => {
                if (player.oranges) {
                    return {
                        Name: player.name,
                        Fitness: player.fitness,
                        Box: player.oranges.box,
                        Basket: player.oranges.basket,
                        Dish: player.oranges.dish,
                        Credit: this.calculateCredit(player),
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
                    columns={[ 'Name', 'Fitness', 'Box', 'Basket', 'Dish',
                                'Credit', 'Reputation', 'Loan', 'Ready' ]}
                    showPager={false} resultsPerPage={99}
                    useFixedLayout={false}
                    tableClassName='little-griddle'
                    columnMetadata={ COL_META } />
                <Negotiation />
            </div>;
        }
        return <div styles={[styles.container]}></div>;  // fallback
    }
}
