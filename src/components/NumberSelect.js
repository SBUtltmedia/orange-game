import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

export default class Market extends Component {
    static propTypes = {
        n: PropTypes.number.isRequired
    };

    render() {
        return <select>
            { _.map(_.range(1, this.props.n + 1), i => <option>{i}</option>) }
        </select>;
    }
}
