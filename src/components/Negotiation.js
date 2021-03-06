import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { verticalCenter } from '../styles/Themes';
import _ from 'lodash';
import model from '../model';
import { deriveMyOpenTransactions, derivePlayer } from '../gameUtils';
import { NumberPicker } from 'react-widgets';
import { openOffer, updateOffer, rejectOffer, acceptOffer } from '../actions/MarketActions';
import { CREATING, OPEN, ACCEPTED, REJECTED, PAID_BACK } from '../constants/NegotiationStates';
import { LOAN } from '../constants/EventTypes';
import { connect } from 'redux/react';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

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

function renderButton(title, fn, cssClass, enabled=true) {
    return <button disabled={!enabled} style={styles.button}
            className={`btn ${cssClass}`} onClick={fn}>
        {title}
    </button>;
}

@connect(state => ({
    firebase: state.firebase
}))
export default class Negotiation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            thisTransaction: null,
            nowOranges: 1,
            laterOranges: 1,
            originalNowOranges: 1,
            originalLaterOranges: 1,
        }
    }

    checkMyTransactions(firebase) {
        const transactions = deriveMyOpenTransactions(firebase);
        const hasTransactions = !_.isEmpty(transactions);
        this.setState({
            modalIsOpen: hasTransactions
        });
        if (hasTransactions) {
            const transaction = _.first(transactions);
            this.setState({
                thisTransaction: transaction,
                nowOranges: transaction.oranges.now,
                laterOranges: transaction.oranges.later,
                originalNowOranges: transaction.oranges.now,
                originalLaterOranges: transaction.oranges.later
            });
        }
    }

    componentWillReceiveProps(newProps) {
        const { firebase } = newProps;
        this.checkMyTransactions(firebase);
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    open() {
        const { thisTransaction, nowOranges, laterOranges } = this.state;
        const type = thisTransaction.lastEventType ===
                     LOAN.OFFER_WINDOW_OPENED ? LOAN.OFFERED : LOAN.ASKED;
        openOffer(thisTransaction, nowOranges, laterOranges, type);
    }

    reject() {
        const { firebase } = this.props;
        const { thisTransaction } = this.state;
        rejectOffer(thisTransaction, () => this.checkMyTransactions(transactions));
    }

    accept() {
        const { firebase } = this.props;
        const { thisTransaction } = this.state;
        acceptOffer(thisTransaction, () => this.checkMyTransactions(firebase));
    }

    counter() {
        const { thisTransaction, nowOranges, laterOranges } = this.state;
        updateOffer(thisTransaction, nowOranges, laterOranges);
    }

    onNowChange(value) {
        this.setState({ nowOranges: value });
    }

    onLaterChange(value) {
        this.setState({ laterOranges: value });
    }

    renderSendButton(enabled=true) {
        return renderButton('Send', () => this.open(), 'btn-success', enabled);
    }

    renderAcceptButton(enabled=true) {
        return renderButton('Accept', () => this.accept(), 'btn-success', enabled);
    }

    renderCancelButton(enabled=true) {
        return renderButton('Cancel', () => this.reject(), 'btn-danger', enabled);
    }

    renderRejectButton(enabled=true) {
        return renderButton('Reject', () => this.reject(), 'btn-danger', enabled);
    }

    renderCounterButton(enabled=true) {
        return renderButton('Send counter-offer', () => this.counter(), '', enabled);
    }

    renderButtons() {
        const { thisTransaction, nowOranges, laterOranges, originalNowOranges,
                                    originalLaterOranges } = this.state;
        if (thisTransaction) {
            if (thisTransaction.state === CREATING) {
                return <div style={styles.buttons}>
                    { this.renderSendButton() }
                    { this.renderCancelButton() }
                </div>;
            }
            else {
                if (thisTransaction.lastToAct === model.authId) {
                    return <div style={styles.buttons}>
                        { this.renderCancelButton() }
                    </div>;
                }
                else {
                    const hasChangedValues = nowOranges !== originalNowOranges ||
                                           laterOranges !== originalLaterOranges;
                    return <div style={styles.buttons}>
                        { this.renderAcceptButton(!hasChangedValues) }
                        { this.renderCounterButton(hasChangedValues) }
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
        const { firebase } = this.props;
        if (thisTransaction) {
            const canChange = thisTransaction.lastToAct !== model.authId ||
                                thisTransaction.state === CREATING;
            const lender = derivePlayer(firebase, model.gameId, thisTransaction.lender);
            const borrower = derivePlayer(firebase, model.gameId, thisTransaction.borrower);
            const max = lender.oranges.basket;
            const min = max >= 1 ? 1 : 0;
            return <Modal className="Modal__Bootstrap modal-dialog medium"
                            isOpen={modalIsOpen} onRequestClose={() => {}}>
                <h2>Negotiate a loan</h2>
                <div>Lender: {lender.name}</div>
                <div>Borrower: {borrower.name}</div>
                <br />
                <form ref="form" onSubmit={e => e.preventDefault()}>
                    <div style={styles.fl}>
                        <NumberPicker style={styles.numberPicker}
                            value={nowOranges} min={min} max={max} disabled={!canChange}
                            onChange={this.onNowChange.bind(this)} />
                        <div style={styles.sentenceWords}>oranges now for</div>
                        <NumberPicker style={styles.numberPicker}
                            value={laterOranges} min={min} disabled={!canChange}
                            onChange={this.onLaterChange.bind(this)} />
                        <div style={styles.sentenceWords}>oranges later</div>
                    </div>
                    { this.renderButtons() }
                </form>
            </Modal>;
        }
        else {
            return <div></div>;  // fallback
        }
    }
}
