import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TodoText from './TodoText';
import { ajax } from 'jquery';

class TodoItem extends Component {
	constructor() {
		super();
		this.state = {
			isDone: false,
			id:''
		}
	}
	update(e) {
		console.log(this.state.isDone);
		if(this.state.isDone){
			ajax({
	          method: "GET",
	          url: 'http://localhost:9000/api/post/updateNoteState',
	          data: {content:false, id:this.props.id}
	        })
			this.setState({
				isDone: false,
			})
		} else {
			ajax({
	          method: "GET",
	          url: 'http://localhost:9000/api/post/updateNoteState',
	          data: {content:true, id:this.props.id}
	        })
	  		this.setState({
				isDone: true,
			})
		}
	}
	componentWillMount(){
		this.setState({
			isDone:this.props.isDone,
			id:this.props.id
		})
		console.log(this.props.isDone);
	}
	unmount(){
		ReactDOM.unmountComponentAtNode(document.getElementById('a'))
	}
	render() {
		if(this.state.isDone){
			return (
				<div id='a' onClick={this.update.bind(this)}>
					<input id="checkBox" className="done-button" type="checkbox" checked={this.state.isDone} onClick={this.update.bind(this)}/>
					<TodoText content={this.props.content} isDoneClass="done"/>
				</div>
			);
		} else {
			return (
				<div id='a' onClick={this.update.bind(this)}>
					<input id="checkBox" className="done-button" type="checkbox" checked={this.state.isDone} onClick={this.update.bind(this)}/>
					<TodoText content={this.props.content} isDoneClass="notDone"/>
				</div>
			);
		}
	}
}
//<TodoCheckbox />
//<button onClick={this.update.bind(this)} className="done-button">{this.state.doneText}</button>

export default TodoItem;
