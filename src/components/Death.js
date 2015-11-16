import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import model from '../model';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import StyleSheet from'react-style';
import { isThisPlayerDead } from '../gameUtils';
import { connect } from 'redux/react';
import { Link } from 'react-router';

const appElement = document.getElementById(APP_ROOT_ELEMENT);
Modal.setAppElement(appElement);
Modal.injectCSS();

const styles = StyleSheet.create({
    link: {
        margin: 4
    }
});

@connect(state => ({
    firebase: state.firebase
}))
export default class Death extends Component {
    render() {
        const { firebase } = this.props;
        return <Modal className="Modal__Bootstrap modal-dialog short"
                        isOpen={isThisPlayerDead(firebase)}
                        onRequestClose={() => this.closeModal()}>
            <h2>You are dead!</h2>
            Please visit the
            <a style={styles.link} href="/?#/game-over/{model.gameId}">game over</a>
            page.
        </Modal>;
    }
}
