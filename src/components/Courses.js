import React, { Component } from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import './style/Courses.css';

class Course extends Component {

	constructor() {
		// Required function call for every constructor
		super();

		// Bind every class function to 'this'
		this.retrieveCourses = this.retrieveCourses.bind(this);
		this.renderCourse = this.renderCourse.bind(this);
		//Set up our state
		this.state = {
			courses: []
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
					<div className="col s12 m6 l6">
						<h4>Course List</h4>
						<label>Department
							<select className="browser-default custom-select" defaultValue="0">
								<option value="0" disabled>Choose your department</option>
								<option value="1">Accounting (ACC)</option>
								<option value="2">Air Force ROTC (AF)</option>
								<option value="3">Army ROTC (AR)</option>
								<option value="4">Atmospheric Science (ATM)</option>
								<option value="5">Biochem & Molecular Biology (BMB)</option>
								<option value="6">Biological Sciences (BL)</option>
								<option value="7">Biomedical Engineering (BE)</option>
								<option value="8">Business (BUS)</option>
								<option value="9">Business Administration (BA)</option>
								<option value="10">Chemical Engineering (CM)</option>
								<option value="11">Chemistry (CH)</option>
								<option value="12">Civil & Environmental Engineering (CEE)</option>
								<option value="13">Computational Science & Engineering (CSE)</option>
								<option value="14">Computer Science (CS)</option>
								<option value="15">Construction Management (CMG)</option>
								<option value="16">Economics (EC)</option>
								<option value="17">Education (ED)</option>
								<option value="18">Eletrical & Computer Engineering (EE)</option>
								<option value="19">Electrical Engineering Technology (EET)</option>
								<option value="20">Engineering Fundamentals (ENG)</option>
								<option value="21">English as a Second Language (ESL)</option>
								<option value="22">Enterprise (ENT)</option>
								<option value="23">Finance (FIN)</option>
								<option value="24">Forest Resources & Environmental Science (FW)</option>
								<option value="25">Geology & Mining Engineering & Sciences (GE)</option>
								<option value="26">Humanities (HU)</option>
								<option value="27">Kinesiology/Integ Physiology (EH)</option>
								<option value="28">Management (MGT)</option>
								<option value="29">Management Information Services (MIS)</option>
								<option value="30">Marketing (MKT)</option>
								<option value="31">Materials Science & Engineering (MY)</option>
								<option value="32">Mathematical Sciences (MA)</option>
								<option value="33">Mechanical Engineering - Engineering Mechanics (MEEM)</option>
								<option value="34">Mechanical Engineering TEchnology (MET)</option>
								<option value="35">Operations & Supply Chain Management (OSM)</option>
								<option value="36">Pavlis Honors (HON)</option>
								<option value="37">Physical Education (PE)</option>
								<option value="38">Physics (PH)</option>
								<option value="39">Psychology (PSY)</option>
								<option value="40">Sciences & Arts (SA)</option>
								<option value="41">Social Sciences (SS)</option>
								<option value="42">Surveying (SU)</option>
								<option value="43">Systems Administation Technology (SAT)</option>
								<option value="44">University Wide (UN)</option>
								<option value="45">Visual & Performing Arts (FA)</option>
							</select>
						</label>
						<ul className="property-list collapsible" data-collapsible="accordion">
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
