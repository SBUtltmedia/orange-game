import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd/modules/backends/HTML5';
import Controls from '../components/Controls';
import OrangeBox from '../components/OrangeBox';
import Basket from '../components/Basket';
import Dish from '../components/Dish';
import Stats from '../components/Stats';
import Players from '../components/Players';
import { areaTheme } from '../styles/Themes';
import { bindActionCreators } from 'redux';
import * as GameActions from '../actions/GameActions';
import { connect } from 'redux/react';
import { getUserData, getFbRef } from '../utils';
import _ from 'lodash';

const styles = {
  container: {
    backgroundColor: '#ffad00',
    color: '#000',
    height: "100%"
  },
  row: {
      display: "flex",
      height: areaTheme.height + areaTheme.margin
  }
};

@connect(state => ({
    game: state.game,
    authId: state.user.authId
}))
@DragDropContext(HTML5Backend)
export default class Game extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        authId: PropTypes.string.isRequired
    };

    componentWillMount() {
        const { dispatch, params } = this.props;
        this.actions = bindActionCreators(GameActions, dispatch);
        getUserData(this);
        this.actions.gameLoad(params.gameId);
    }

    componentWillReceiveProps(nextProps) {

        console.log("NEXT", nextProps);

        const { game, authId } = nextProps;
        const { gameId, oranges } = game;
        if (gameId && authId && oranges) {
            const ref = getFbRef(`/games/${gameId}/players/${authId}`);
            ref.update(_.omit(game, ['gameId', 'authId']));
        }
    }

    render() {
        return <div style={styles.container}>
            <div style={styles.row}>
                <Basket actions={this.actions} />
                <Controls actions={this.actions} />
                <Dish actions={this.actions} />
            </div>
            <div style={styles.row}>
                <Stats actions={this.actions} />
                <Players actions={this.actions} />
            </div>
        </div>;
    }
}
