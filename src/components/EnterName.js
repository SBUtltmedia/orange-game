import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';

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
            modalIsOpen: props.open
        };
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    login() {
        const name = React.findDOMNode(this.refs.textBox).value;
        actions.loginUser(name);
        this.closeModal();
    }

    componentDidMount() {
        //React.findDOMNode(this.refs.textBox).focus();  // Doesn't work
    }

    render() {
        return <Modal isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal.bind(this)}>
              <h2>Enter name</h2>
              <form>
                <input ref="textBox" />
                <input type="submit" onClick={this.login.bind(this)} value="OK" />
              </form>
        </Modal>;
  }
}
