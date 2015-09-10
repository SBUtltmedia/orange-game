import React, { PropTypes, Component } from 'react';
import { areaTheme, verticalCenter } from '../styles/Themes';
import model from '../model';
import { connect } from 'redux/react';
import { getThisPlayerDebts, getThisPlayerCredits, getThisGameDay, getMyFitness, getMyFitnessChange } from '../gameUtils';
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
      paddingLeft: 50,
      textAlign: 'left'
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

function renderDebt(transaction) {
    return <li>
        {transaction.lender.name}: &nbsp;
        <span style={styles.debt}>{transaction.oranges.later}</span>
        { this.renderPayButton(transaction) }
    </li>;
}

function renderCredit(transaction) {
    return <li>
        {transaction.borrower.name}: &nbsp;
        <span style={styles.credit}>{transaction.oranges.later}</span>
    </li>;
}

@connect(state => ({
    firebase: state.firebase
}))
export default class Stats extends Component {

    canPay(transaction) {
        const { firebase } = this.props;

        //const player = getThisPlayer(firebase);
        //return player.oranges.basket >= transaction.oranges.later;

        // TODO: Fix

        return true;
    }

    renderPayButton(transaction) {
        if (this.canPay(transaction)) {
            return <a onClick={() => payDebt(transaction)}>pay</a>;
        }
        else {
            return <span></span>;
        }
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
        return this.renderDebtsOrCredits(getThisPlayerDebts, renderDebt);
    }

    renderCredits() {
        return this.renderDebtsOrCredits(getThisPlayerCredits, renderCredit);
    }

    render() {
        const { firebase } = this.props;
        const fitness = getMyFitness(firebase);
        const fitnessChange = getMyFitnessChange(firebase);
        const day = getThisGameDay(firebase);
        var fitnessChangeColor = getFitnessChangeColor(fitnessChange);
        return <div style={styles.container}>
            <div style={styles.title}>Your stats</div>
            <div style={styles.inner}>
                <p>
                    <span>Day:</span>
                    &nbsp;
                    <span style={styles.value}>{day}</span>
                </p>
                <p>
                    <span>Fitness:</span>
                    &nbsp;
                    <span style={styles.value}>{fitness}</span>
                </p>
                <p>
                    <span>Change:</span>
                    &nbsp;
                    <span style={{...styles.value, color: fitnessChangeColor}}>
                                    {formatChange(fitnessChange)}
                    </span>
                </p>
                <p>
                    <span>Debts:</span> { this.renderDebts() }
                </p>
                <p>
                    <span>Credits:</span> { this.renderCredits() }
                </p>
            </div>
        </div>;
    }
}
