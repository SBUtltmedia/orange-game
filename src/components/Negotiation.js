import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { verticalCenter } from '../styles/Themes';
import _ from 'lodash';
import model from '../model';
import NumberSelect from './NumberSelect';
import { getFbRef, subscribeToFbList, updateFbObject } from '../utils';
import { NumberPicker } from 'react-widgets';
import { openOffer, updateOffer, rejectOffer, acceptOffer } from '../actions/MarketActions';
import { CREATING, OPEN, ACCEPTED, REJECTED } from '../constants/NegotiationStates';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

function transactionIsOpenAndContainsPlayer(player, trans) {
    return (trans.state === OPEN &&
           (trans.lender.authId === player.authId ||
           trans.borrower.authId === player.authId)) ||
           (trans.state === CREATING && trans.createdBy === player.authId);
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
    buttons: {
        marginTop: 16
    },
    button: {
        marginRight: 12
    }
};

function renderButton(title, fn, cssClass) {
    return <button style={styles.button} className={`btn ${cssClass}`} onClick={fn}>
        {title}
    </button>;
}

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
        const thisTransaction = _.find(transactions, f);
        this.setState({
            modalIsOpen: !!thisTransaction
        });
        if (thisTransaction) {
            this.setState({
                thisTransaction: thisTransaction,
                nowOranges: thisTransaction.oranges.now,
                laterOranges: thisTransaction.oranges.later
            })
        }
    }

    componentWillMount() {
        this.firebaseRef = getFbRef(`/games/${model.gameId}/transactions`);
        subscribeToFbList(this, this.firebaseRef, 'transactions', 'id',
                            transactions => this.check(transactions));
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    open() {
        const { thisTransaction, nowOranges, laterOranges } = this.state;
        openOffer(thisTransaction.id, nowOranges, laterOranges);
    }

    reject() {
        const { thisTransaction } = this.state;
        rejectOffer(thisTransaction.id, () => this.check(this.state.transactions));
    }

    accept() {
        const { thisTransaction } = this.state;
        acceptOffer(thisTransaction.id, () => this.check(this.state.transactions));
    }

    counter() {
        const form = React.findDOMNode(this.refs.form);
        form.submit();
    }

    onFormSubmit(event) {
        const { thisTransaction, nowOranges, laterOranges } = this.state;
        updateOffer(thisTransaction.id, nowOranges, laterOranges);
        event.preventDefault();
    }

    onNowChange(value) {
        this.setState({ nowOranges: value });
    }

    onLaterChange(value) {
        this.setState({ laterOranges: value });
    }

    renderAcceptButton() {
        const { thisTransaction } = this.state;
        const fn = () => {
            if (thisTransaction.state === CREATING) {
                return () => this.open();
            }
            else {
                return () => this.accept();
            }
        }();
        return renderButton('Accept', fn, 'btn-success');
    }

    renderRejectButton() {
        return renderButton('Reject', () => this.reject(), 'btn-danger');
    }

    renderCounterButton() {
        return renderButton('Send counter-offer', () => this.counter(), '');
    }

    renderButtons() {
        const { thisTransaction } = this.state;
        if (thisTransaction) {
            if (thisTransaction.state === CREATING) {
                return <div style={styles.buttons}>
                    { this.renderAcceptButton() }
                    { this.renderRejectButton() }
                </div>;
            }
            else {
                if (thisTransaction.lastToAct === model.authId) {
                    return <div style={styles.buttons}>
                        { this.renderRejectButton() }
                    </div>;
                }
                else {
                    return <div style={styles.buttons}>
                        { this.renderAcceptButton() }
                        { this.renderCounterButton() }
                        { this.renderRejectButton() }
                    </div>;
                }
            }
        }
        else {
            return <div></div>;
        }
    }

    render() {
        const { modalIsOpen, thisTransaction, nowOranges, laterOranges } = this.state;
        return <Modal className="Modal__Bootstrap modal-dialog medium"
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
                    <div style={styles.sentenceWords}>oranges later</div>
                </div>
                { this.renderButtons() }
            </form>
        </Modal>;
    }
}
