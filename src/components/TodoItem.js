import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TodoCheckbox from './TodoCheckbox';
import TodoText from './TodoText'

class TodoItem extends Component {
	constructor() {
		super();
		this.state = {
			isDone: false,
			isDoneClass: 'notDone',
			doneText: 'Not Done'
		}
	}
	update(e) {
		if(this.state.isDoneClass === 'done'){
			this.setState({
				isDone: false,
				isDoneClass: 'notDone',
				doneText: 'Not Done'
			})
		} else {
			this.setState({
				isDone: true,
				isDoneClass: 'done',
				doneText: 'Done'
			})
		}
		
	}
	unmount(){
		ReactDOM.unmountComponentAtNode(document.getElementById('a'))
	}
	render() {
		return (
			<div id='a' onClick={this.update.bind(this)}>
				<input id="checkBox" className="done-button" type="checkbox" checked={this.state.isDone} onClick={this.update.bind(this)}/>
				<TodoText person={this.props.person} isDoneClass={this.state.isDoneClass}/>
			</div>
		);
	}
}
//<TodoCheckbox />
//<button onClick={this.update.bind(this)} className="done-button">{this.state.doneText}</button>

export default TodoItem;
