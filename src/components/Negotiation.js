import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { verticalCenter } from '../styles/Themes';
import _ from 'lodash';
import model from '../model';
import NumberSelect from './NumberSelect';
import { getFbRef, subscribeToFirebaseList, updateFbObject } from '../utils';
import { NumberPicker } from 'react-widgets';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

function transactionIsOpenAndContainsPlayer(player, trans) {
    return trans.open &&
           (trans.giver.authId === player.authId ||
           trans.receiver.authId === player.authId);
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
        marginRight: 14,
        marginTop: 6
    }
};

export default class Negotiation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            thisTransaction: null,
            modalIsOpen: false
        }
    }

    check(transactions) {
        const f = _.bind(transactionIsOpenAndContainsPlayer, {}, model);

        console.log('callback', _.some(transactions, f));

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
        updateFbObject(url, { open: false });
        this.check(this.state.transactions);
    }

    render() {
        const { modalIsOpen, thisTransaction } = this.state;
        return <Modal className="Modal__Bootstrap modal-dialog"
                        isOpen={modalIsOpen} onRequestClose={() => {}}>
              <h2>Negotiate!</h2>
              <div>Giver: {thisTransaction ? thisTransaction.giver.name : ''}</div>
              <div>Receiver: {thisTransaction ? thisTransaction.receiver.name : ''}</div>
              <br />
              <div style={styles.fl}>
                  <NumberPicker style={styles.numberPicker}
                        defaultValue={1} min={1} max={9} />
                  <div style={styles.sentenceWords}>oranges now for</div>
                  <NumberPicker style={styles.numberPicker}
                        defaultValue={1} min={1} max={9} />
                  <div style={styles.sentenceWords}>oranges later.</div>
              </div>
              <br />
              <button onClick={() => this.reject()}>Reject</button>
        </Modal>;
    }
}
