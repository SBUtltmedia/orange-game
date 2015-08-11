import React, { PropTypes, Component } from 'react';

const styles = {
    container: {
        textAlign: 'left',
        padding: 2
    }
}

export default class ChatMessage extends Component {

    static propTypes = {
        message: PropTypes.object.isRequired
    };

    render() {
        const { message } = this.props;
        return <div style={styles.container}>
            {message.name}: {message.text}
        </div>
    }
}
