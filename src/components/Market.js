import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { subscribeToFirebaseList, getFbRef } from '../utils';
import _ from 'lodash';
import model from '../model';

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
        return <Modal isOpen={modalIsOpen} onRequestClose={() => this.closeModal()}>
          <h2>Market</h2>
              <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Fitness</td>
                        <td>Available Oranges</td>
                        <td>Debt</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(players, p => <tr>
                            <td>{p.name}</td>
                            <td>{p.fitness}</td>
                            <td>{p.oranges.box + p.oranges.basket}</td>
                            <td>?</td>
                        </tr>)
                    }
                </tbody>
            </table>
            <button onClick={() => this.closeModal()}>Close</button>
        </Modal>;
    }
}
