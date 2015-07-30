import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import _ from 'lodash';
import model from '../model';
import Griddle from 'griddle-react';
import NumberSelect from './NumberSelect';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

export default class Market extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: props.open,
            players: []
        };
    }

    componentWillMount() {
        this.firebaseRef = getFbRef(`/games/${model.gameId}/players`);
        subscribeToFirebaseList(this, this.firebaseRef, 'players', 'authId');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    componentWillReceiveProps(props) {
        this.setState({ modalIsOpen: props.open });
    }

    render() {
        const { modalIsOpen, players } = this.state;
        const tableData = _.map(players, player => { return {
            Name: player.name,
            Fitness: player.fitness,
            'Available oranges': player.oranges.box + player.oranges.basket,
            'Debts to pay': Math.ceil(Math.random() * 10) + ' oranges',
            'Loan payments to receive': Math.ceil(Math.random() * 10) + ' oranges',
            'Loan offer': '3 oranges now for 4 oranges in 2 days',
            'Interest/day': Math.round(100 * 1 / 6) + '%'
        }});
        return <Modal className="Modal__Bootstrap modal-dialog wide"
                isOpen={modalIsOpen} onRequestClose={() => this.closeModal()}>
            <div className="modal-header">
              <button type="button" className="close" onClick={() => this.closeModal()}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h2 className="modal-title">Market</h2>
            </div>
            <Griddle id="market-table" results={tableData} />
            <br /><br />
            <form onSubmit={() => alert('Not implemented')}>
                <h3>Offer loan</h3>
                <p>
                    <NumberSelect n={model.availableOranges || 10} /> oranges now for &nbsp;
                    <NumberSelect n={model.availableOranges * 4 || 40} /> oranges in &nbsp;
                    <NumberSelect n={model.daysLeft} /> days &nbsp;
                    <input type="submit" value="Send offer" /> &nbsp;
                </p>
                <p>
                    (<b>17%</b> interest per day)
                </p>
            </form>
            <br />
            <form onSubmit={() => alert('Not implemented')}>
                <h3>Request loan</h3>
                <p>
                    <NumberSelect n={12} /> oranges &nbsp;
                    <input type="submit" value="Send request" /> &nbsp;
                </p>
            </form>
        </Modal>;
    }
}
