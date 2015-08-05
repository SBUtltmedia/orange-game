import React, { PropTypes, Component } from 'react';
import Griddle from 'griddle-react';
import _ from 'lodash';

export default class GriddleTest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentWillMount() {
        setTimeout(() => {
            this.setState({
                items: [
                    { players: [ 'Jun', 'Togawa' ] }
                ]
            });
        }, 3000);
    }

    render() {
        const { items } = this.state;
        const tableData = _.map(items, item => { return {
            Joined: _.size(item.players),
            Players: _.map(item.players, p => p.name).join(', ')
        }});
        return <Griddle results={tableData} columns={[ 'Joined', 'Players' ]} />;
    }
}
