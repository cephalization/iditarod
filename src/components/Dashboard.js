import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';

class Dashboard extends Component {

	constructor() {
		super();

		this.retrieveAuditHistory = this.retrieveAuditHistory.bind(this);
		this.retrieveCourses = this.retrieveCourseHistory.bind(this);
		this.loadCourseHistory = this.loadCourseHistory.bind(this);
		this.renderCourseHistory = this.renderCourseHistory.bind(this);

		this.state = {
			courseHistory: [],
			auditHistory: []
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

	retrieveCourseHistory() {
		let dashboardRef = this;
		FirebaseActions.courseHistory(cookie.load('TOKEN'), function (response){
			const courseHistory = response.userSpace.Courses;
			console.log(courseHistory);
			if (courseHistory.initialized) {
				let courseList = [];
				for (let course in courseHistory) {
					if (courseHistory.hasOwnProperty(course)) {
						courseList.push(dashboardRef.renderCourseHistory(courseHistory[course]));
					}
					dashboardRef.setState({
						courseHistory:courseList
					});
				}
			} else {
				console.log('There is no course history for the user');
				dashboardRef.loadCourseHistory(false);
			}
		});
	}

	renderCourseHistory(course) {
		const courseInfo = (
			<li key={course.name}>{course.name}</li>
		);
		return courseInfo;
	}

	loadCourseHistory(historyExists) {
		if (historyExists) {
			return;
		} else {
			const notExists = (
				<div>
					<p>You have not taken any courses yet!</p>
				</div>
			);
			this.setState({
				courseHistory: notExists
			});
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
									{this.state.courseHistory}
								</div>
							</div>
							<div className="col l12 m12 s12">
								<div className="information-panel panel-sm">
									<h3>Audits</h3>
									<p>IF audit has not been run, show link to run degree audit</p>
									<p>ELSE audit has been run, show link to view audit</p>
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
