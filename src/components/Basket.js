import React, { PropTypes, Component } from 'react';
import Bin from './Bin';
import ItemTypes from '../constants/ItemTypes';
import { areaTheme } from '../styles/Themes';

const styles = {
    container: {
      ...areaTheme
    }
}

export default class Basket {
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
