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
			courses: []
		};
		//Async call to retrieve courses
		this.retrieveCourses();
	}

	retrieveCourses() {
		// Make modifications to an object referring the class's 'this'
		let coursesRef = this;

		// Fetch the data, convert response to json, assign json object to 'courses'
		fetch('/courses/allCourses').then((response) => response.json())
		.then(function (response) {
			console.log(response);
			let courses = [];

			for (let course in response.courses) {
				if (response.courses.hasOwnProperty(course)) {
					console.log('course is', course);
					courses.push(
						// This code needs to be abstracted into a class Component Talk to Tony about
						// how to pass props, etc
						<li key={course}> { course + ' - ' + response.courses[course].name}</li>
					);
				}
			}
			coursesRef.setState({
				courses: courses
			});
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	render() {

		return (
			<div>
				<div className="container">
					<ul>
						{this.state.courses}
					</ul>
				</div>
			</div>);
	}
}

export default Dashboard;
