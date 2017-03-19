import React, { Component } from 'react';

class Course extends Component {

	componentWillMount(){
		this.props.checkAuth("Courses");
	}

	render() {
		return (
			<div>
				<div className="container">
					<h3>Courses Component!</h3>
				</div>
			</div>
		);
	}
}

Course.contextTypes = {
	router: React.PropTypes.object
};

export default Course;
