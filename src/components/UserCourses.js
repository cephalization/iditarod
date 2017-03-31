import React, { Component } from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';
import './style/Courses.css';

class UserCourses extends Component {

	constructor() {
    // Required function call for every constructor
		super();

    // Bind every class function to 'this'
		this.retrieveCourses = this.retrieveCourses.bind(this);
		this.renderCourse = this.renderCourse.bind(this);
    //Set up our state
		this.state = {
			userCourses: [],
			courseInitialized: true
		};
	}

	componentDidMount() {
		this.retrieveCourses();
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
						Credits: {course.credits}
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
		FirebaseActions.userSpace(cookie.load('TOKEN'), function (response) {
			let userCourses = [];
			console.log('User\'s courses are:', response.userSpace.Courses);
			if (response.userSpace.Courses.initialized) {
				for (let course in response.userSpace.Courses) {
					if (response.userSpace.Courses.hasOwnProperty(course) && course !== 'initialized') {
						const courseObject = response.userSpace.Courses[course];
						userCourses.push(
							coursesRef.renderCourse(courseObject, course, true)
						);
					}
				}
				coursesRef.setState({
					userCourses: userCourses
				});
			} else {
				coursesRef.setState({
					courseInitialized: false
				});
			}
		});
	}

	renderUserCourses() {
		if (this.state.courseInitialized) {
			const exists = this.state.userCourses.length ? this.state.userCourses : '...' ;
			return exists;
		} else {
			const notExists = (
				<li>
					<div>
						<p>You have not taken any courses yet.</p>
						<p>Add some with the tool on this page!</p>
					</div>
				</li>
			);
			return notExists;
		}
	}

	render() {
		return (
      <div className="col s12 m6 l6">
        <h5>My Courses</h5>
        <ul className="property-list collapsible" data-collapsible="accordion">
          {this.renderUserCourses()}
        </ul>
      </div>
		);
	}

}

UserCourses.contextTypes = {
	router: React.PropTypes.object
};

UserCourses.PropTypes = {
	checkAuth: React.PropTypes.func
};

export default UserCourses;
