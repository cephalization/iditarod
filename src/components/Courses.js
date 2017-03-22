import React, { Component } from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import './style/Courses.css';

class Course extends Component {

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

	componentWillMount(){
		this.props.checkAuth("Courses");
	}


	retrieveCourses() {
		// Make modifications to an object referring the class's 'this'
		let coursesRef = this;
		// Fetch the data from firebase
		FirebaseActions.allCourses(function (response) {
			let courses = [];

			for (let course in response.courses) {
				if (response.courses.hasOwnProperty(course)) {
					//console.log('course is', course);
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
		});
	}


	render() {
		return (
			<div>
				<div className='class'>
					<h1>Course List</h1>
					<ul>
						{this.state.courses}
					</ul>
				</div>
			</div>
		);
	}
}

Course.contextTypes = {
	router: React.PropTypes.object
};

export default Course;
