import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { verticalCenter } from '../styles/Themes';
import _ from 'lodash';
import model from '../model';
import NumberSelect from './NumberSelect';
import { getFbRef, subscribeToFirebaseList, updateFbObject } from '../utils';
import { NumberPicker } from 'react-widgets';
import { updateNegotiation } from '../actions/MarketActions';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

function transactionIsOpenAndContainsPlayer(player, trans) {
    return trans.open &&
           (trans.lender.authId === player.authId ||
           trans.borrower.authId === player.authId);
}

const styles = {
    numberPicker: {
        width: 70
    },
    fl: {
        display: 'flex'
    },
    sentenceWords: {
        marginLeft: 12,
        marginRight: 13,
        marginTop: 6
    },
    button: {
        marginRight: 12
    }
};

export default class Negotiation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            thisTransaction: null,
            modalIsOpen: false,
            nowOranges: 1,
            laterOranges: 1
        }
    }

    check(transactions) {
        const f = _.bind(transactionIsOpenAndContainsPlayer, {}, model);
        this.setState({
            modalIsOpen: _.some(transactions, f),
            thisTransaction: _.find(transactions, f)
        });
    }

    componentWillMount() {
        this.firebaseRef = getFbRef(`/games/${model.gameId}/transactions`);
        subscribeToFirebaseList(this, this.firebaseRef, 'transactions', 'id', (ts) => this.check(ts));
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    reject() {
        const { thisTransaction } = this.state;
        const url = `/games/${model.gameId}/transactions/${thisTransaction.id}`;
        updateFbObject(url, { open: false }, () => this.check(this.state.transactions));
    }

    onFormSubmit(event) {
        const { thisTransaction, nowOranges, laterOranges } = this.state;
        updateNegotiation(thisTransaction.id, nowOranges, laterOranges);
        event.preventDefault();
    }

    onNowChange(value) {
        this.setState({ nowOranges: value });
    }

    onLaterChange(value) {
        this.setState({ laterOranges: value });
    }

    counter() {
        const form = React.findDOMNode(this.refs.form);
        form.submit();
    }

    render() {
        const { modalIsOpen, thisTransaction, nowOranges, laterOranges } = this.state;
        return <Modal className="Modal__Bootstrap modal-dialog"
                        isOpen={modalIsOpen} onRequestClose={() => {}}>
            <h2>Negotiate a loan</h2>
            <div>Lender: {thisTransaction ? thisTransaction.lender.name : ''}</div>
            <div>Borrower: {thisTransaction ? thisTransaction.borrower.name : ''}</div>
            <br />
            <form ref="form" onSubmit={e => this.onFormSubmit(e)}>
                <div style={styles.fl}>
                    <NumberPicker style={styles.numberPicker}
                        value={nowOranges} min={1} max={9}
                        onChange={this.onNowChange.bind(this)} />
                    <div style={styles.sentenceWords}>oranges now for</div>
                    <NumberPicker style={styles.numberPicker}
                        value={laterOranges} min={1} max={9}
                        onChange={this.onLaterChange.bind(this)} />
                    <div style={styles.sentenceWords}>oranges later.</div>
                </div>
                <br />
                <button style={styles.button} className="btn btn-success" onClick={() => this.counter()}>
                    Send counter-offer
                </button>
                <button style={styles.button} className="btn btn-danger" onClick={() => this.reject()}>
                    Reject completely
                </button>
            </form>
        </Modal>;
    }
}
