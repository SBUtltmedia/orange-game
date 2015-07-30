import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { APP_ROOT_ELEMENT } from '../constants/Settings';

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
            modalIsOpen: props.open
        };
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        return <Modal isOpen={this.state.modalIsOpen}
                      onRequestClose={() => this.closeModal()}>

          { /* Close button or 'X' */}

          <h2>Market</h2>
              <table>
                <tr>
                    <td>

                    </td>
                </tr>
            </table>
        </Modal>;
    }
}
