import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';

class Dashboard extends Component {

	constructor() {
		super();

		this.retrieveAuditHistory = this.retrieveAuditHistory.bind(this);
		this.renderAudit = this.renderAudit.bind(this);
		this.renderAuditHistory = this.renderAuditHistory.bind(this);
		this.retrieveCourseHistory = this.retrieveCourseHistory.bind(this);
		this.renderCourse = this.renderCourse.bind(this);
		this.renderCourseHistory = this.renderCourseHistory.bind(this);

		this.state = {
			courseHistory: [],
			courseInitialized: true,
			auditHistory: [],
			auditInitialized: true
		};
	}

	componentDidMount(){
		const props = this.props;
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		props.checkAuth('Dashboard');
		this.retrieveCourseHistory();
	}

	retrieveAuditHistory() {

	}

	renderAudit() {

	}

	renderAuditHistory() {

	}

	retrieveCourseHistory() {
		let dashboardRef = this;
		FirebaseActions.userSpace(cookie.load('TOKEN'), function (response){
			const courseHistory = response.userSpace.Courses;
			console.log(courseHistory);
			if (courseHistory.initialized) {
				let courseList = [];
				let maxHist = 3;
				let hist = 0;
				for (let course in courseHistory) {
					if (courseHistory.hasOwnProperty(course) && course !== 'initialized' && hist < maxHist) {
						courseList.push(dashboardRef.renderCourse(courseHistory[course]));
						hist ++;
					}
					dashboardRef.setState({
						courseHistory: courseList,
					});
				}
			} else {
				console.log('There is no course history for the user');
				dashboardRef.setState({
					courseInitialized: courseHistory.initialized
				});
			}
		});
	}

	renderCourse(course) {
		const courseInfo = (
			<li key={course.name}>{course.name}</li>
		);
		return courseInfo;
	}

	renderCourseHistory() {
		if (this.state.courseInitialized) {
			const exists = (
				<div className="content-section">
					<p>Your most recent courses</p>
					<ul>
						{this.state.courseHistory.length ? this.state.courseHistory : '...' }
					</ul>
				</div>
			);
			return exists;
		} else {
			const notExists = (
				<div className="content-section">
					<p>You have not taken any courses yet!</p>
					<a className="btn" href="/courses">Add Courses</a>
				</div>
			);
			return notExists;
		}
	}

	render() {
		return (
			<div>
				<div>
					<div className="row center-align">
						<div className="col l8 m8 s12">
							<div className="information-panel panel-lg">
								<h2>Overall Degree Completion</h2>
								<p>IF degree not selected, offer selection of degrees</p>
								<p>ELSE show a chart.js chart offering an overall percentage of completion</p>
							</div>
						</div>
						<div className="col l4 m4 s12">
							<div className="col l12 m12 s12">
								<div className="information-panel panel-sm">
									<h3>Courses</h3>
									{this.renderCourseHistory()}
								</div>
							</div>
							<div className="col l12 m12 s12">
								<div className="information-panel panel-sm">
									<h3>Audits</h3>
									{this.state.auditHistory}
								</div>
							</div>
						</div>
					</div>
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
