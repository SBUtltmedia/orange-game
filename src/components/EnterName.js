import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { setName, isNameTaken } from '../actions/LobbyActions';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { authId } from '../model';
import { trimString } from '../utils';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

export default class EnterName extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: props.open,
            error: null
        };
    }

    login() {
        const name = trimString(React.findDOMNode(this.refs.textBox).value);
        if (name === '') {
            this.setState({ error: 'Name cannot be blank' });
        }
        else if (isNameTaken(name)) {
            this.setState({ error: 'Name is already taken' });
        }
        else {
            setName(authId, name);
            this.closeModal();
        }
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
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
              <div>{this.state.error}</div>
        </Modal>;
    }
}
