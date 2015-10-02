import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import { areaTheme } from '../styles/Themes';
import { getOrangesInMyBasket } from '../gameUtils';
import { connect } from 'redux/react';

const styles = {
    container: {
      ...areaTheme
    }
}

@connect(state => ({
    firebase: state.firebase
}))
export default class Basket extends Component {

    render() {
        const { firebase } = this.props;
        const oranges = getOrangesInMyBasket(firebase);
        return <Bin style={styles.container} textual={true} graphical={true}
                    name="basket" label="Oranges saved" oranges={oranges} />
    }
}
