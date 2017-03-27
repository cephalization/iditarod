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
		this.renderCourse = this
		.renderCourse
		.bind(this);
		//Set up our state
		this.state = {
			courses: []
		};
	}

	componentDidMount(){
		const props = this.props;
		props.checkAuth('Courses');
		window.$('.collapsible').collapsible();
		//Async call to retrieve courses
		this.retrieveCourses();
	}

	componentWillUnmount() {
		this.state.setState({courses: []});
	}

	renderCourse(course, keyName, taken) {
		let courseActions;
		if (taken) {
			courseActions = (
				<div>
					<button className="btn waves-effect waves-light">Remove from Courses</button>
				</div>
			);
		} else {
			courseActions = (
				<div>
					<button className="btn waves-effect waves-light">Add to Courses</button>
				</div>
			);
		}
		const courseItem = (
			<li key={keyName} className="information-panel panel-sm">
				<div className="collapsible-header">
					{course.prettyClassNum}
					<br />
					{course.name}
				</div>
				<div className="collapsible-body">
					<span>
						{course.credits} credit(s)
						<br />
						Available {course.semesters}
					</span>
					{courseActions}
				</div>
			</li>
		);
		return courseItem;
	}

	retrieveCourses() {
		// Make modifications to an object referring the class's 'this'
		let coursesRef = this;
		// Fetch the data from firebase
		FirebaseActions.allCourses(function (response) {
			let courses = [];
			console.log('All courses are', response.courses);
			for (let course in response.courses) {
				if (response.courses.hasOwnProperty(course)) {
					const courseObject = response.courses[course];
					courses.push(
						// This code needs to be abstracted into a class Component Talk to Tony about
						// how to pass props, etc
						
						<li key={course} className="information-panel panel-sm">
							<div className="collapsible-header">{courseObject.prettyClassNum + ' - ' + courseObject.name}</div>
							<div className="collapsible-body"><span>{courseObject.credits} credit(s) <br></br>Available {courseObject.semesters}</span></div>
						</li>
						coursesRef.renderCourse(courseObject, course)
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
				<div className="row">
					<div className='col s12 m6 l6'>
						<h4>Course List</h4>
						<ul className='property-list collapsible' data-collapsible='accordion'>
							{this.state.courses}
						</ul>
					</div>
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
