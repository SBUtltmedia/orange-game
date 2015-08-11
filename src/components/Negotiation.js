import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import _ from 'lodash';
import model from '../model';
import NumberSelect from './NumberSelect';
import { getFbRef, subscribeToFirebaseList } from '../utils';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

function transactionContainsPlayer(player, trans) {

    console.log(player, trans);

    return trans.giver === player.authId || trans.receiver === player.authId;
}

export default class Negotiation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            modalIsOpen: false
        }
    }

    componentWillMount() {

        console.log("mount");

        const callback = () => {

            console.log("callback");

            const { transactions } = this.state;
            const f = _.bind(transactionContainsPlayer, {}, model);
            this.setState({ modalIsOpen: _.some(transactions, f) });
        };
        this.firebaseRef = getFbRef(`/games/${model.gameId}/transactions`);
        subscribeToFirebaseList(this, this.firebaseRef, 'transactions', null, callback);
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

    render() {
        return <Modal className="Modal__Bootstrap modal-dialog"
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={() => {}}>
              Negotiate!
        </Modal>;
    }
}
