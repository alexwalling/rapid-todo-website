import React, { Component } from 'react';
import TodoItem from './TodoItem';
import { ajax } from 'jquery';

class TodoList extends Component {
	constructor() {
		super();
		this.state = {
      items: [],
    }
	}
	componentWillMount(){
    	// fetch( 'http://swapi.co/api/people/?format=json')
    	// 	.then( response => response.json() )
    	//   .then( ({results: items}) => this.setState({items}))

      // fetch( 'http://localhost:9000/api/get/singleNote')
      //   .then( response => response.json() )
      //   .then( function(data){
      //     let info = data;
      //     console.log(info);
      //     this.setState({items: info});
      //   })

        ajax({
          method: "GET",
          url: 'http://localhost:9000/api/get/singleNote'
        }).then((res) => {
          this.setState({items: res})
        });
        //.then( ({results: items}) => this.setState({items}))
  	}
	render() {
		let items = this.state.items
		//let items = ['hello','hello2','hello3','hello4','hello5','hello6','hello7','hello8','hello9','hello10','hello11','hello12','hello13','hello14','hello15','hello16','hello17','hello18','hello19','hello20','hello21']
    if(items.length != 0){
      console.log(items);
      return (
        <div>
          {items.map(item => <TodoItem key={item._id} id={item._id} content={item.content} isDone={item.isDone}/> )}
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}

export default TodoList;

