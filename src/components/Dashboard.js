import React, { Component } from 'react';

class Dashboard extends Component {
	constructor() {
		// Required function call for every constructor
		super();

		// Bind every class function to 'this'
		this.retrieveCourses = this.retrieveCourses.bind(this);
	}

	retrieveCourses() {
		fetch('/courses/allCourses').then(function(response){
			console.log(response);
			return response;
		});
	}

	render() {
		return (
			<div>
				Dashboard Component!
				<p>
					{this.retrieveCourses()}
				</p>
			</div>
		);
	}
}

export default Dashboard;
