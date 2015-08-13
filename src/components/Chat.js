import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import { subscribeToFbList, getFbRef, trimString } from '../utils';
import { sendChat } from '../actions/GameActions';
import ChatMessage from '../components/ChatMessage';
import _ from 'lodash';
import model from '../model';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgray',
      width: 300,
      position: 'relative'
  },
  output: {
      padding: 10,
      overflow: 'scroll',
      height: 285
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
      marginTop: 10
  },
  preset: {
      fontSize: 10
  }
};

const ASK_PRESET_TEXT = 'Can I borrow oranges?';
const OFFER_PRESET_TEXT = 'I have oranges to borrow.';

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }

    componentWillMount() {
        const { gameId } = model;
        const url = `/games/${gameId}/chat`;
        this.firebaseRef = getFbRef(url);
        const callback = () => {
            setTimeout(() => {
                const output = React.findDOMNode(this.refs.output);
                output.scrollTop = 999999999;
            }, 100);
        };
        subscribeToFbList(this, this.firebaseRef, 'messages', null, callback);
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    onFormSubmit(event) {
        const textBox = React.findDOMNode(this.refs.textBox);
        const text = trimString(textBox.value);
        if (text !== '') {
            sendChat(text);
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

    render() {
        const { messages } = this.state;
        return <div style={styles.container}>
            <div ref="output" style={styles.output}>
                {_.map(messages, msg => <ChatMessage message={msg} />)}
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
