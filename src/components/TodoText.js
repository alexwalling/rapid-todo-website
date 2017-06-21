import React, { Component } from 'react';

class TodoText extends Component {
  render() {
    return (
    	<div>
    		<p className={this.props.isDoneClass}>{this.props.content}</p>
    	</div>
    );
  }
}

export default TodoText;
