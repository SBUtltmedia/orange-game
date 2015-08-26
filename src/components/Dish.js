import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import { areaTheme } from '../styles/Themes';

const styles = {
    container: {
      ...areaTheme
    }
}

export default class Dish extends Component {

    render() {
        return <Bin style={styles.container} textual={true} graphical={true}
                    name="dish" label="Oranges eaten" />
    }
}
