import React, { Component } from 'react';
import * as FirebaseActions from '../firebaseFunctions';
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
			userCourses: []
		};
	}

	componentDidMount(){
		const props = this.props;
		props.checkAuth('Courses');
		window.$('.collapsible').collapsible();
		window.$('select').material_select();
    //Async call to retrieve courses
		this.retrieveCourses();
	}

	componentWillUnmount() {
		this.state.setState({userCourses: []});
	}

	renderCourse(course, keyName, taken) {
		let courseActions;

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
		FirebaseActions.userSpace(function (response) {
			let userCourses = [];
			console.log('User\'s courses are:', response.userCourses);
			for (let course in response.userCourses) {
				if (response.courses.hasOwnProperty(course)) {
					const courseObject = response.userCourses[course];
					userCourses.push(
            coursesRef.renderCourse(courseObject, course)
          );
				}
			}
			coursesRef.setState({
				userSpace: userCourses
			});
		});
	}

	render() {
		return (
      <div>
        <h4>My Courses</h4>
        <ul className="property-list collapsible" data-collapsible="accordion">
          {this.state.userCourses}
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
