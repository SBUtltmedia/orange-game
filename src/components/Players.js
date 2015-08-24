import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import _ from 'lodash';
import { openAskNegotiation, openOfferNegotiation } from '../actions/MarketActions';
import model from '../model';
import Griddle from 'griddle-react';
import Negotiation from '../components/Negotiation';
import { connect } from 'redux/react';
import { getThisGame, getThisPlayer, getPlayerTransactions } from '../gameUtils';

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

class LoanComponent extends Component {

    createAskButton(player, canAsk, firebase) {
        return createButton('Ask', () =>
                    openAskNegotiation(player, firebase), canAsk);
    }

    createOfferButton(player, canOffer, firebase) {
        return createButton('Offer', () =>
                    openOfferNegotiation(player, firebase), canOffer);
    }

    render() {
        if (this.props.data) {
            const { player, firebase } = this.props.data;
            if (player && player.oranges) {
                const me = getThisPlayer(firebase);
                const isSelf = player.authId === model.authId;
                const canOffer = !isSelf && me.oranges.basket > 0;
                const canAsk = !isSelf && player.oranges.basket > 0;
                return <div>
                    { this.createAskButton(player, canAsk, firebase) }
                    { this.createOfferButton(player, canOffer, firebase) }
                </div>;
            }
        }
        return <div></div>;
    }
}

class ReadyComponent extends Component {
    render() {
        if (this.props.data) {
            const { player, firebase } = this.props.data;
            const game = getThisGame(firebase);
            if (player && player.day > game.day) {
                return <img style={styles.checkmark}
                        src={require("../../images/checkmark.png")} />;
            }
        }
        return <div></div>;
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
                        Loan: { player: player, firebase: firebase },
                        Ready: { player: player, firebase: firebase }
                    };
                }
                else {
                    return {
                        Name: player.name
                    };
                }
            });

            console.log(tableData);

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
