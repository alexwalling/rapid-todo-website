import React, { Component } from 'react';
import TodoItem from './TodoItem';

class TodoList extends Component {
	constructor() {
		super();
		this.state = {items: []}
	}
	componentWillMount(){
    	fetch( 'http://swapi.co/api/people/?format=json')
    		.then( response => response.json() )
    		.then( ({results: items}) => this.setState({items}))
  	}
	render() {
		let items = this.state.items
		//let items = ['hello','hello2','hello3','hello4','hello5','hello6','hello7','hello8','hello9','hello10','hello11','hello12','hello13','hello14','hello15','hello16','hello17','hello18','hello19','hello20','hello21']

    	return (
      		<div>
      			{items.map(item => <TodoItem key={item.name} person={item.name}/> )}
      		</div>
    	);
  	}
}

export default TodoList;
