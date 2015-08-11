import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import _ from 'lodash';
import model from '../model';
import NumberSelect from './NumberSelect';
import { getFbRef, subscribeToFirebaseList, updateFbObject } from '../utils';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

function transactionIsOpenAndContainsPlayer(player, trans) {
    return trans.open &&
           (trans.giver.authId === player.authId ||
           trans.receiver.authId === player.authId);
}

export default class Negotiation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            thisTransaction: null,
            modalIsOpen: false
        }
    }

    componentWillMount() {
        const callback = (transactions) => {
            const f = _.bind(transactionIsOpenAndContainsPlayer, {}, model);

            console.log('callback', _.some(transactions, f));

            this.setState({
                modalIsOpen: _.some(transactions, f),
                thisTransaction: _.find(transactions, f)
            });
        };
        this.firebaseRef = getFbRef(`/games/${model.gameId}/transactions`);
        subscribeToFirebaseList(this, this.firebaseRef, 'transactions', 'id', callback);
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
        this.closeModal();
    }

    render() {
        const { modalIsOpen, thisTransaction } = this.state;
        return <Modal className="Modal__Bootstrap modal-dialog"
                        isOpen={modalIsOpen} onRequestClose={() => {}}>
              <h2>Negotiate!</h2>
              <div>Giver: {thisTransaction ? thisTransaction.giver.name : ''}</div>
              <div>Receiver: {thisTransaction ? thisTransaction.receiver.name : ''}</div>
              <button onClick={() => this.reject()}>Reject</button>
        </Modal>;
    }
}
