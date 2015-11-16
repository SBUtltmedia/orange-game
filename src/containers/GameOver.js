import React, { Component, PropTypes } from 'react';
import StyleSheet from 'react-style';
import { Link } from 'react-router';
import Survey from '../components/Survey';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        height: '100%'
    }
});

export default class GameOver extends Component {

    render() {
        const { params } = this.props;
        return <div style={styles.page}>
            <div>Game is finished.</div>
            <br />
            { /* <div><Link to="lobby">Play again</Link></div> */ }
            <Survey gameId={params.gameId} />
        </div>;
    }
}
