import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';

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

	componentDidMount(){
		this._isMounted = true;
		console.log(this);
		const props = this.props;
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		props.checkAuth('Dashboard');
	}

	componentWillUnmount() {
		console.log('Dashboard unmounted!');
		this._isMounted = false;
	}

	retrieveCourses() {
		if (this._isMounted) {
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
							<li key={course}> {course + ' - ' + response.courses[course].name}</li>
						);
					}
				}
				coursesRef.setState({
					courses: courses
				});
			});
		}
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

Dashboard.contextTypes = {
	router: React.PropTypes.object
};

Dashboard.PropTypes = {
	checkAuth: React.PropTypes.func
};

export default Dashboard;
