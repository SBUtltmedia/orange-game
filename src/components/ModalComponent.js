import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

export default class ModalComponent extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: props.open
        };
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    renderBody() {  /** Override in subclass **/
        return <div></div>;
    }

    render() {
        return <Modal isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal.bind(this)}>
              {this.renderBody()}
        </Modal>;
  }
}
