import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import { trimString } from '../utils';
import { sendChat } from '../actions/GameActions';
import ChatMessage from '../components/ChatMessage';
import _ from 'lodash';
import model from '../model';
import { connect } from 'redux/react';
import { getChatInThisGame } from '../gameUtils';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgray',
      width: 300,
      position: 'relative'
  },
  output: {
      padding: 10,
      "overflow-y": 'scroll',
      height: 288
  },
  input: {
      position: 'absolute',
      bottom: 0,
      width: '100%'
  },
  textBox: {
      width: 200,
      margin: 'auto'
  },
  presets: {
      marginTop: 8
  },
  preset: {
      fontSize: 10
  }
};

const ASK_PRESET_TEXT = 'Can I borrow oranges?';
const OFFER_PRESET_TEXT = 'I have oranges to borrow.';

@connect(state => ({
    firebase: state.firebase
}))
export default class Chat extends Component {

    onFormSubmit(event) {
        const { firebase } = this.props;
        const textBox = React.findDOMNode(this.refs.textBox);
        const text = trimString(textBox.value);
        if (text !== '') {
            sendChat(text, firebase);
            textBox.value = '';
        }
        event.preventDefault();
    }

    onPresetClick(text) {
        const textBox = React.findDOMNode(this.refs.textBox);
        const form = React.findDOMNode(this.refs.form);
        textBox.value = text;
        form.submit();
    }

    scrollToBottom() {
        setTimeout(() => {
            const output = React.findDOMNode(this.refs.output);
            if (output) {
                output.scrollTop = 999999999;
            }
        }, 100);
    }

    render() {
        this.scrollToBottom();
        const { authId } = model;
        const { firebase } = this.props;
        const chat = getChatInThisGame(firebase);
        return <div style={styles.container}>
            <div ref="output" style={styles.output}>
                {_.map(chat, (msg, i) => <ChatMessage message={msg} key={i} />)}
            </div>
            <form ref="form" style={styles.input} onSubmit={e => this.onFormSubmit(e)}>
                <input ref="textBox" style={styles.textBox} />
                <input type="submit" value="Send" />
                <div style={styles.presets}>
                    <button style={styles.preset}
                    onClick={() => this.onPresetClick(ASK_PRESET_TEXT)}>
                        {ASK_PRESET_TEXT}
                    </button>
                    <button style={styles.preset}
                    onClick={() => this.onPresetClick(OFFER_PRESET_TEXT)}>
                        {OFFER_PRESET_TEXT}
                    </button>
                </div>
            </form>
        </div>;
    }
}
