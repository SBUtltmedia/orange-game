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
            trans.giver === player.authId || trans.receiver === player.authId;
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
        const callback = () => {
            const { transactions } = this.state;
            const f = _.bind(transactionIsOpenAndContainsPlayer, {}, model);
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

    openModal() {
        this.setState({ modalIsOpen: true });
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
        return <Modal className="Modal__Bootstrap modal-dialog"
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={() => {}}>
              <h2>Negotiate!</h2>
              <button onClick={() => this.reject()}>Reject</button>
        </Modal>;
    }
}
