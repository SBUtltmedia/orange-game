import React, { PropTypes, Component } from 'react/addons';

const styles = {
    container: {
        backgroundColor: 'purple',
    }
};

export default class Player extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
    };

    render() {
        const { name } = this.props; 
        return <div style={styles.container}>
            {name}
        </div>;
    }
}
