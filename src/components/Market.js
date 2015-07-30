import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import _ from 'lodash';
import model from '../model';
import Griddle from 'griddle-react';

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
            'Available oranges': player.oranges.box + player.oranges.basket
        }});
        return <Modal isOpen={modalIsOpen} onRequestClose={() => this.closeModal()}>
          <h2>Market</h2>
            <Griddle id="market-table" results={tableData} />
            <button onClick={() => this.closeModal()}>Close</button>
        </Modal>;
    }
}
