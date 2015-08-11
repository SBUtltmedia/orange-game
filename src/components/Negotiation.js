import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import _ from 'lodash';
import model from '../model';
import NumberSelect from './NumberSelect';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

export default class Negotiation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        }
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
                        onRequestClose={() => this.closeModal()}>
              Negotiate!
        </Modal>;
    }
}
