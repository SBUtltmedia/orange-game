import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import { areaTheme } from '../styles/Themes';
import { getOrangesInDish } from '../gameUtils';
import { connect } from 'redux/react';

const styles = {
    container: {
      ...areaTheme
    }
}

@connect(state => ({
    firebase: state.firebase
}))
export default class Dish extends Component {

    render() {
        const { firebase } = this.props;
        const oranges = getOrangesInDish(firebase);
        return <Bin style={styles.container} textual={true} graphical={true}
                    name="dish" label="Oranges eaten" oranges={oranges} />
    }
}
