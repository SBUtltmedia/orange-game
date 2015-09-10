import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import { areaTheme } from '../styles/Themes';
import { getOrangesInBasket } from '../gameUtils';
import { connect } from 'redux/react';

const styles = {
    container: {
      ...areaTheme
    }
}

export default class Basket extends Component {

    render() {
        const { firebase } = this.props;
        const oranges = getOrangesInBasket(firebase);
        return <Bin style={styles.container} textual={true} graphical={true}
                    name="basket" label="Oranges saved" oranges={oranges} />
    }
}
