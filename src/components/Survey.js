import React, { PropTypes, Component } from 'react';
import model from '../model';
import { connect } from 'redux/react';
import { trimString } from '../utils';
import { updateFbObject } from '../firebaseUtils';
import { APP_ROOT_ELEMENT } from '../constants/Settings';
import StyleSheet from'react-style';

const styles = StyleSheet.create({
    container: {
        textAlign: 'left',
        width: 400,
        margin: 'auto'
    },
    textarea: {
        width: '100%'
    }
});

@connect(state => ({
    firebase: state.firebase
}))
export default class Survey extends Component {

    save(data) {
        const { gameId } = this.props;
        updateFbObject(`/games/${gameId}/players/${model.authId}/survey`, data);
    }

    onSubmit(event) {
        const { firebase } = this.props;
        const sex = trimString(React.findDOMNode(this.refs.sex).value);
        const age = trimString(React.findDOMNode(this.refs.age).value);
        const ethnicity = trimString(React.findDOMNode(this.refs.ethnicity).value);
        const how = trimString(React.findDOMNode(this.refs.how).value);
        const other = trimString(React.findDOMNode(this.refs.other).value);
        if (sex !== '' && age !== '' && ethnicity !== '' && how !== '') {
            this.save({ sex, age, ethnicity, how, other });
            window.location.href = '/';  // Go home
        }
        event.preventDefault();
    }

    render() {
        return <div style={styles.container}>
            <p>Please fill in the following information.</p>
            <form onSubmit={e => this.onSubmit(e)}>
              <p>
                  <label for="sex">Sex:&nbsp;</label>
                  <input id="sex" ref="sex" />
              </p>
              <p>
                  <label for="age">Age:&nbsp;</label>
                  <select id="age" ref="age">
                      { _.map(_.range(17, 100), x => <option key={x}>{x}</option>) }
                  </select>
              </p>
              <p>
                  <label for="ethnicity">Ethnicity:&nbsp;</label>
                  <input id="ethnicity" ref="ethnicity" />
              </p>
              <p>
                  <b>How did you make your decisions in this study?</b>
                  <textarea id="how" ref="how" style={styles.textarea} />
              </p>
              <p>
                  <b>Please write any other comments about the study below.</b>
                  <textarea id="other" ref="other" style={styles.textarea} />
              </p>
              <input value="Submit" type="submit" />
            </form>
        </div>;
    }
}
