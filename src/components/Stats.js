import React, { PropTypes, Component } from 'react';
import { areaTheme, verticalCenter } from '../styles/Themes';
import model from '../model';
import { connect } from 'redux/react';
import { getThisPlayerDebts, getThisPlayerCredits, getThisGameDay, getMyFitness,
        getMyFitnessChangeToday, canPayOffLoan, derivePlayer } from '../gameUtils';
import _ from 'lodash';
import { payDebt } from '../actions/MarketActions';

const styles = {
    container: {
      ...areaTheme,
      backgroundColor: 'lightgreen',
      width: 250
    },
    title: {
      paddingTop: 16,
      paddingBottom: 16,
      fontWeight: 'bold'
    },
    inner: {
      paddingLeft: 30,
      textAlign: 'left'
    },
    item: {
        marginBottom: 10,
    },
    debt: {
      color: 'red',
      fontWeight: 'bold',
      marginRight: 8
    },
    credit: {
      color: 'green',
      fontWeight: 'bold'
    }
};

function getFitnessChangeColor(change) {
    if (change > 0) {
      return 'green';
    }
    else if (change < 0) {
      return 'red';
    }
    else {
      return 'black';
    }
}

function formatChange(change) {
    if (change > 0) {
      return '+' + change;
    }
    else {
      return change;
    }
}

@connect(state => ({
    firebase: state.firebase
}))
export default class Stats extends Component {

    renderPayButton(transaction) {
        const { firebase } = this.props;
        if (canPayOffLoan(firebase, transaction)) {
            return <button onClick={() => payDebt(transaction)}>Repay</button>
        }
        else {
            return <button disabled="true" title="Not enough oranges in basket to repay loan">Repay</button>
        }
    }

    renderDebt(transaction) {
        const { firebase } = this.props;
        const lender = derivePlayer(firebase, model.gameId, transaction.lender);
        return <li>
            {lender.name}: &nbsp;
            <span style={styles.debt}>{transaction.oranges.later}</span>
            { this.renderPayButton(transaction) }
        </li>;
    }

    renderCredit(transaction) {
        const { firebase } = this.props;
        const borrower = derivePlayer(firebase, model.gameId, transaction.borrower);
        return <li>
            {borrower.name}: &nbsp;
            <span style={styles.credit}>{transaction.oranges.later}</span>
        </li>;
    }

    renderDebtsOrCredits(fetchFn, renderFn) {
        const { firebase } = this.props;
        const items = fetchFn(firebase);
        if (_.isEmpty(items)) {
            return <span>none</span>;
        }
        else {
            return <ul>{ _.map(items, item => renderFn(item)) }</ul>;
        }
    }

    renderDebts() {
        return this.renderDebtsOrCredits(getThisPlayerDebts, t => this.renderDebt(t));
    }

    renderCredits() {
        return this.renderDebtsOrCredits(getThisPlayerCredits, t => this.renderCredit(t));
    }

    render() {
        const { firebase } = this.props;
        const fitness = getMyFitness(firebase);
        const fitnessChange = getMyFitnessChangeToday(firebase);
        const day = getThisGameDay(firebase);
        var fitnessChangeColor = getFitnessChangeColor(fitnessChange);
        return <div style={styles.container}>
            <div style={styles.title}>Your stats</div>
            <div style={styles.inner}>
                <div style={styles.item}>
                    <span>Day:</span>
                    &nbsp;
                    <span style={styles.value}>{day}</span>
                </div>
                <div style={styles.item}>
                    <span>Fitness:</span>
                    &nbsp;
                    <span style={styles.value}>{fitness}</span>
                </div>
                <div style={styles.item}>
                    <span>Change:</span>
                    &nbsp;
                    <span style={{...styles.value, color: fitnessChangeColor}}>
                                    {formatChange(fitnessChange)}
                    </span>
                </div>
                <div style={styles.item}>
                    <span>Debts:</span> { this.renderDebts() }
                </div>
                <div style={styles.item}>
                    <span>Credits:</span> { this.renderCredits() }
                </div>
            </div>
        </div>;
    }
}
