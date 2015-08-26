import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { setName, checkIfNameTaken } from '../actions/LobbyActions';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import { authId } from '../model';
import { trimString } from '../utils';
import StyleSheet from'react-style';
import { connect } from 'redux/react';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

const styles = StyleSheet.create({
    error: {
        color: "#F00",
        fontSize: 14,
        fontWeight: "bold"
    }
});

@connect(state => ({
    firebase: state.firebase
}))
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

    onSubmit(event) {
        const { firebase } = this.props;
        const name = trimString(React.findDOMNode(this.refs.textBox).value);
        if (name === '') {
            this.setState({ error: 'Name cannot be blank' });
        }
        else {
            if (checkIfNameTaken(name, firebase)) {
                this.setState({ error: 'Name is already taken' });
            }
            else {
                setName(authId, name);
                this.closeModal();
            }
        }
        event.preventDefault();
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
              <form onSubmit={e => this.onSubmit(e)}>
                <input ref="textBox" />
                <input type="submit" value="OK" />
              </form>
              <div style={styles.error}>{this.state.error}</div>
        </Modal>;
    }
}
