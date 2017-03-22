import React, { Component } from 'react';

class Course extends Component {

	componentDidMount(){
		const props = this.props;
		props.checkAuth('Courses');
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

Course.PropTypes = {
	checkAuth: React.PropTypes.func
};

export default Course;
