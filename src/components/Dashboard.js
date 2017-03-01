import React, {Component} from 'react';

class Dashboard extends Component {
	constructor() {
		// Required function call for every constructor
		super();

		// Bind every class function to 'this'
		this.retrieveCourses = this
			.retrieveCourses
			.bind(this);
		//Set up our state
		this.state = {
			courseJSON: ''
		};
		//Async call to retreive courses
		this.retrieveCourses();
	}

	retrieveCourses() {
		fetch('/courses/allCourses')
			.then(function (response) {
				console.log(response);
				return response.text();
			})
			.then(function (responseJSON) {
				console.log(responseJSON);
				this.setState({courseJSON: responseJSON});
			}.bind(this))
			.catch(function (error) {
				console.log(error);
			});
	}

	render() {
		return (
			<div>
				Dashboard Component!
				<p>
					{this.state.courseJSON}
				</p>
			</div>
		);
	}
}

export default Dashboard;
