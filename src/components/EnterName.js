import React, { PropTypes, Component } from 'react';
import ModalComponent from './ModalComponent';

export default class EnterName extends ModalComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired
    };

    login() {
        const { actions } = this.props;
        const name = React.findDOMNode(this.refs.textBox).value;
        actions.loginUser(name);
        this.closeModal();
    }

    componentDidMount() {
        //React.findDOMNode(this.refs.textBox).focus();  // Doesn't work
    }

    renderBody() {
        return <div>
              <h2>Enter name</h2>
              <form>
                <input ref="textBox" />
                <input type="submit" onClick={this.login.bind(this)} value="OK" />
              </form>
        </div>;
  }
}
