import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import { areaTheme } from '../styles/Themes';

const styles = {
    container: {
      ...areaTheme
    }
}

export default class Basket extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions } = this.props;
    return <Bin actions={actions} style={styles.container}
                textual={true} graphical={true}
                name="basket" label="Oranges saved" />
  }
}
