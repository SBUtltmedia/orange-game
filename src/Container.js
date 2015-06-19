import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd/modules/backends/HTML5';
import ItemTypes from './ItemTypes';
import update from 'react/lib/update';
import Controls from './Controls';
import OrangeBox from './OrangeBox';
import Basket from './Basket';
import Dish from './Dish';
import Stats from './Stats';
import { areaTheme } from './Themes';

var myDispatcher = require('./Dispatcher');

var ListStore = {

	// Actual collection of model data
	items: [],

	// Accessor method we'll use later
	getAll: function() {
		return this.items;
	}

};

		myDispatcher.register( function( payload ) {

			switch( payload.eventName ) {

				case 'new-item':

					// We get to mutate data!
					ListStore.items.push( payload.newItem );
					console.log(ListStore);
					break;

			}

			return true; // Needed for Flux promise resolution

		}); 

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
}

@DragDropContext(HTML5Backend)
	export default class Container extends Component {
		constructor(props) {
			super(props);
			
			this.state = {
				oranges: 10,
				basket: 0,
				dish: 0,
				totalDays: 0
			};
		}

		render() {
			return (
					<div style={styles.container}>
					<div style={styles.row}>
					<Basket onHover={this.onBasketHover.bind(this)} onDrop={this.onBasketDrop.bind(this)} oranges={this.state.basket} />
					<Controls onNewDay={this.onNewDay.bind(this)} oranges={this.state.oranges} />
					<Dish onHover={this.onBasketHover.bind(this)} onDrop={this.onDishDrop.bind(this)} oranges={this.state.dish} />
					</div>
					<div style={styles.row}>
					<Stats totalDays={this.state.totalDays} />
					</div>
					</div>
				   );
		}







		onBasketHover(item)
		{
			//console.log(myDispatcher);

		}


		onBasketDrop() {
			this.increment('basket');
			this.decrement('oranges');
		}

		onDishDrop() {
			this.increment('dish');
			this.decrement('oranges');
		}

		onNewDay() {

			//console.log(myDispatcher);
			myDispatcher.dispatch({
				eventName: 'new-item',
			newItem: { name: 'Marco' }}); 

			this.increment('totalDays');
			}

			increment(field) {
				this.setState({
					field: this.state[field] += 1
				});
			}

			decrement(field) {
				this.setState({
					field: this.state[field] -= 1
				});
			}
			}
