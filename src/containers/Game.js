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
import { gameLoad } from '../actions/GameActions';
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

@DragDropContext(HTML5Backend)
export default class Game extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        gameId: PropTypes.string.isRequired,
        authId: PropTypes.string.isRequired
    };

    componentWillMount() {
        const { params } = this.props;
        gameLoad(params.gameId);
    }

    componentDidMount() {
        getUserData(this);
    }

    componentWillReceiveProps(nextProps) {
        const { game, authId, gameId } = nextProps;
        if (gameId && authId) {
            const ref = getFbRef(`/games/${gameId}/players/${authId}`);
            ref.update(_.omit(game, ['gameId', 'authId']));
        }
    }

    render() {
        return <div style={styles.container}>
            <div style={styles.row}>
                <Basket />
                <Controls />
                <Dish />
            </div>
            <div style={styles.row}>
                <Stats />
                <Players />
            </div>
        </div>;
    }
}
