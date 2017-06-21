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
        ajax({
          method: "GET",
          url: 'http://ec2-34-211-91-3.us-west-2.compute.amazonaws.com/api/get/singleNote'
        }).then((res) => {
          this.setState({items: res})
        });
  	}
	render() {
		let items = this.state.items
    if(items.length != 0){
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

