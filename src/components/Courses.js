import React, { Component } from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import UserCourses from './UserCourses';
import cookie from 'react-cookie';
import './style/Courses.css';

class Course extends Component {

	constructor() {
		// Required function call for every constructor
		super();

		// Bind every class function to 'this'
		this.retrieveCourses = this.retrieveCourses.bind(this);
		this.renderCourse = this.renderCourse.bind(this);
		this.filterCourses = this.filterCourses.bind(this);
		this.addUserCourse = this.addUserCourse.bind(this);
		this.removeUserCourse = this.removeUserCourse.bind(this);
		this.retrieveUserCourses = this.retrieveUserCourses.bind(this);
		//Set up our state
		this.state = {
			courses: [],
			rawCourses: [],
			userCourses: [],
			rawUserCourses: [],
			curDept: '',
			userCoursesInitialized: true
		};
	}

	componentDidMount(){
		const props = this.props;
		props.checkAuth('Courses');
		window.$('.collapsible').collapsible();
		window.$('select').material_select();
		//Async call to retrieve courses
		this.retrieveUserCourses();
		this.retrieveCourses();
	}

	componentWillUnmount() {
		this.state.setState({courses: []});
	}

	// This can be optimized a lot, but it works for now
	// What we could do instead of re-rendering every course, trim the key attatched to each
	// course in this.state.courses, check that against department
	filterCourses(department) {
		department = department.target.value;
		let filteredCourses = [];
		let unFilteredCourses = this.state.rawCourses;
		if (unFilteredCourses.length > 0) {
			for (let i = 0; i < unFilteredCourses.length; i++) {
				if (unFilteredCourses[i].department === department) {
					filteredCourses.push(this.renderCourse(unFilteredCourses[i], unFilteredCourses[i].prettyClassNum));
				}
			}
		}
		this.setState({
			courses: filteredCourses,
			curDept: department
		});
	}

	retrieveUserCourses() {
    // Make modifications to an object referring the class's 'this'
		let coursesRef = this;
    // Fetch the data from firebase
		FirebaseActions.userSpace(cookie.load('TOKEN'), function (response) {
			let userCourses = [];
			let rawUserCourses = [];
			if (response.userSpace.Courses.initialized) {
				for (let course in response.userSpace.Courses) {
					if (response.userSpace.Courses.hasOwnProperty(course) && course !== 'initialized') {
						const courseObject = response.userSpace.Courses[course];
						userCourses.push(
							coursesRef.renderCourse(courseObject, course, true)
						);
						rawUserCourses.push(
							courseObject
						);
					}
				}
				coursesRef.setState({
					userCourses: userCourses,
					rawUserCourses: rawUserCourses,
					userCoursesInitialized: true
				});
			} else {
				coursesRef.setState({
					userCoursesInitialized: false
				});
			}
		});
	}

	renderCourse(course, keyName, taken) {
		let courseActions;
		if (taken) {
			courseActions = (
				<div>
					<button className="btn waves-effect waves-light" onClick={() => this.removeUserCourse(course)}>Remove from Courses</button>
				</div>
			);
		} else {
			courseActions = (
				<div>
					<button className="btn waves-effect waves-light" onClick={() => this.addUserCourse(course)}>Add to Courses</button>
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

	addUserCourse(course) {
		let google = cookie.load('TOKEN');
		let coursesRef = this;
		FirebaseActions.addUserCourse(google, course, function (response) {
			if (response.Successful) {
				coursesRef.retrieveUserCourses();
			}
			//remove from courses.
			let courses = coursesRef.state.courses;
			let rawCourses = coursesRef.state.rawCourses;
			courses.splice(
				courses.findIndex((element)=>(element.key===course.slugName)),1
			);
			rawCourses.splice(
				rawCourses.findIndex((element)=>(element.slugName===course.slugName)),1
			);

			coursesRef.setState({
				courses: courses,
				rawCourses: rawCourses
			});
		});
	}

	removeUserCourse(course) {
		let google = cookie.load('TOKEN');
		let coursesRef = this;
		let courses = this.state.courses;
		let rawCourses = this.state.rawCourses;
		FirebaseActions.removeUserCourse(google, course, function(response) {
			if (response.Successful) {
				let uCourses = coursesRef.state.userCourses;
				for (let i = 0; i < uCourses.length; i++) {
					if (uCourses[i].key === course.slugName) {
						uCourses.splice(i, 1);
						break;
					}
				}
				//add the course back to the raw list,
				rawCourses.push(course);
				//sort courses by slugname
				rawCourses.sort(function(a,b){
					if(a.slugName<b.slugName){
						return -1;
					}
					if(a.slugName>b.slugName){
						return 1;
					}
					return 0;
				});
				//add to the displayed courses list, only if the depatment is correct
				if(coursesRef.state.curDept==='' ||course.slugName.startsWith(coursesRef.state.curDept)){
					courses.push(coursesRef.renderCourse(course, course.slugName));
					//sort courses by key
					courses.sort(function(a,b){
						if(a.key<b.key){
							return -1;
						}
						if(a.key>b.key){
							return 1;
						}
						return 0;
					});
				}
				coursesRef.setState({
					userCourses: uCourses,
				});
			}
		});
	}

	retrieveCourses() {
		// Make modifications to an object referring the class's 'this'
		let coursesRef = this;
		// Fetch the data from firebase
		FirebaseActions.allCourses(function (response) {
			let courses = [];
			let rawCourses = [];
			for (let course in response.courses) {
				if (response.courses.hasOwnProperty(course)) {
					const courseObject = response.courses[course];
					//Only add the course to the course list to be displayed if it isn't a user course.
					if(
						coursesRef.state.rawUserCourses.find((element)=>(courseObject.slugName===element.slugName))===undefined
					){
						courses.push(
							coursesRef.renderCourse(courseObject, course)
						);
						rawCourses.push(
							courseObject
						);
					}
				}
			}
			coursesRef.setState({
				courses: courses,
				rawCourses: rawCourses
			});
		});
	}


	render() {
		return (
			<div>
				<div className="row">
					<div className="col s12 m6 l6">
						<h5 className="col s5">Course List</h5>
							<select id="deptChoice" className="browser-default custom-select col s7" defaultValue="0" onChange={(e) => {this.filterCourses(e);}}>
								<option value="0" disabled>Choose your department</option>
								<option value="ACC">Accounting (ACC)</option>
								<option value="AF">Air Force ROTC (AF)</option>
								<option value="AR">Army ROTC (AR)</option>
								<option value="ATM">Atmospheric Science (ATM)</option>
								<option value="BMB">Biochem & Molecular Biology (BMB)</option>
								<option value="BL">Biological Sciences (BL)</option>
								<option value="BE">Biomedical Engineering (BE)</option>
								<option value="BUS">Business (BUS)</option>
								<option value="BA">Business Administration (BA)</option>
								<option value="CM">Chemical Engineering (CM)</option>
								<option value="CH">Chemistry (CH)</option>
								<option value="CEE">Civil & Environmental Engineering (CEE)</option>
								<option value="CSE">Computational Science & Engineering (CSE)</option>
								<option value="CS">Computer Science (CS)</option>
								<option value="CMG">Construction Management (CMG)</option>
								<option value="EC">Economics (EC)</option>
								<option value="ED">Education (ED)</option>
								<option value="EE">Eletrical & Computer Engineering (EE)</option>
								<option value="EET">Electrical Engineering Technology (EET)</option>
								<option value="ENG">Engineering Fundamentals (ENG)</option>
								<option value="ESL">English as a Second Language (ESL)</option>
								<option value="ENT">Enterprise (ENT)</option>
								<option value="FIN">Finance (FIN)</option>
								<option value="FW">Forest Resources & Environmental Science (FW)</option>
								<option value="GE">Geology & Mining Engineering & Sciences (GE)</option>
								<option value="HU">Humanities (HU)</option>
								<option value="EH">Kinesiology/Integ Physiology (EH)</option>
								<option value="MGT">Management (MGT)</option>
								<option value="MIS">Management Information Services (MIS)</option>
								<option value="MKT">Marketing (MKT)</option>
								<option value="MY">Materials Science & Engineering (MY)</option>
								<option value="MA">Mathematical Sciences (MA)</option>
								<option value="MEEM">Mechanical Engineering - Engineering Mechanics (MEEM)</option>
								<option value="MET">Mechanical Engineering TEchnology (MET)</option>
								<option value="OMS">Operations & Supply Chain Management (OSM)</option>
								<option value="HON">Pavlis Honors (HON)</option>
								<option value="PE">Physical Education (PE)</option>
								<option value="PH">Physics (PH)</option>
								<option value="PSY">Psychology (PSY)</option>
								<option value="SA">Sciences & Arts (SA)</option>
								<option value="SS">Social Sciences (SS)</option>
								<option value="SU">Surveying (SU)</option>
								<option value="SAT">Systems Administation Technology (SAT)</option>
								<option value="UN">University Wide (UN)</option>
								<option value="FA">Visual & Performing Arts (FA)</option>
							</select>
							<p>{this.state.value}</p>
						<ul className="property-list collapsible" data-collapsible="accordion">
							{this.state.courses}
						</ul>
					</div>
					<UserCourses courses={this.state.userCourses} initialized={this.state.userCoursesInitialized} removeCourse={this.removeUserCourse}/>
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
