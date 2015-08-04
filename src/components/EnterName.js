import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { setName } from '../actions/LobbyActions';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { authId } from '../model';
import { trimString } from '../utils';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

function isNameAcceptable(name) {
    return trimString(name) !== '';  // TODO: Check for name taken
}

export default class EnterName extends Component {
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

    login() {
        const name = React.findDOMNode(this.refs.textBox).value;
        if (isNameAcceptable(name)) {
            setName(authId, name);
            this.closeModal();
        }
    }

    componentDidMount() {
        //React.findDOMNode(this.refs.textBox).focus();  // Doesn't work
    }

    render() {
        return <Modal className="Modal__Bootstrap modal-dialog short"
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={() => this.closeModal()}>
              <h2>Enter name</h2>
              <form onSubmit={() => this.login()}>
                <input ref="textBox" />
                <input type="submit" value="OK" />
              </form>
        </Modal>;
    }
}
