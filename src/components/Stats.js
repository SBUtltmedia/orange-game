import React, { PropTypes, Component } from 'react';
import { areaTheme, verticalCenter } from '../styles/Themes';
import model from '../model';
import { connect } from 'redux/react';
import { getThisPlayer, getThisPlayerDebts, getThisPlayerCredits } from '../gameUtils';
import _ from 'lodash';

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
      fontWeight: 'bold'
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

    render() {
        const { firebase } = this.props;
        const player = getThisPlayer(firebase);
        const debts = getThisPlayerDebts(firebase);
        const credits = getThisPlayerCredits(firebase);
        if (player) {
            const { fitness, fitnessChange, day } = player;
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
                        <span>Debts:</span>
                        <ul> { _.map(debts, d => renderDebt(d)) }</ul>
                    </p>
                    <p>
                        <span>Credits:</span>
                        <ul> { _.map(credits, c => renderCredit(c)) }</ul>
                    </p>
                </div>
            </div>;
        }
        return <div style={styles.container}></div>  // fallback
    }
}
