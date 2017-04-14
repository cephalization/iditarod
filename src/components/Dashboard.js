import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';
import {Pie} from 'react-chartjs-2';

class Dashboard extends Component {

	constructor() {
		super();

		this.retrieveAuditHistory = this.retrieveAuditHistory.bind(this);
		this.renderAudit = this.renderAudit.bind(this);
		this.renderAuditHistory = this.renderAuditHistory.bind(this);
		this.retrieveCourseHistory = this.retrieveCourseHistory.bind(this);
		this.renderCourse = this.renderCourse.bind(this);
		this.renderCourseHistory = this.renderCourseHistory.bind(this);
		this.retrieveUserSpace = this.retrieveUserSpace.bind(this);
		this.updatePieChart = this.updatePieChart.bind(this);

		this.state = {
			courseHistory: [],
			courses: [],
			courseInitialized: true,
			auditHistory: [],
			audits: [],
			auditInitialized: true,
			chartClass: 'hide',
			chartData:{
				labels:[
					'Completed',
					'Uncompleted'
				],
				datasets:[
					{
						data: [0,0],
						backgroundColor:[
							'#0ef729',
							'#f92020'
						],
						hoverBackgroundColor:[
							'#0ef729',
							'#f92020'
						]
					}
				]
			},
			chartOptions:{
				mantainAspectRatio: false,
				responsive: true
			}
		};
	}

	componentDidMount(){
		const props = this.props;
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		props.checkAuth('Dashboard');
		this.retrieveUserSpace();
		this.updatePieChart();
	}

	retrieveUserSpace() {
		let outerThis = this;
		FirebaseActions.userSpace(cookie.load('TOKEN'), function(response){
			let userSpace = response.userSpace;
			if (userSpace.Courses.initialized) {
				let courseList = [];
				let courses = response.userSpace.Courses;
				for (let course in courses) {
					if (courses.hasOwnProperty(course) && course !== 'initialized') {
						courseList.push(courses[course]);
					}
				}
				outerThis.setState({
					courses: courseList,
				});
				outerThis.retrieveCourseHistory();
			} else {
				outerThis.setState({
					courseInitialized: userSpace.Courses.initialized
				});
			}
			if (userSpace.Audits.initialized) {
				let auditsList = [];
				let audits = response.userSpace.Audits;
				for (let audit in audits) {
					if (audits.hasOwnProperty(audit) && audit !== 'initialized') {
						audits[audit].name = audit;
						auditsList.push(audits[audit]);
					}
				}
				outerThis.setState({
					audits: auditsList,
				});
				outerThis.retrieveAuditHistory();
			} else {
				outerThis.setState({
					auditInitialized: response.userSpace.Audits.initialized
				});
			}
		});
	}

	retrieveAuditHistory() {
		if (this.state.auditInitialized) {
			let auditList = [];
			let maxHist = 3;
			let hist = 0;
			for (let audit in this.state.audits) {
				if (this.state.audits.hasOwnProperty(audit) && hist < maxHist) {
					auditList.push(this.renderAudit(this.state.audits[audit]));
					hist ++;
				}
			}
			this.setState({
				auditHistory: auditList,
			});
		}
	}

	renderAudit(audit) {
		const auditInfo = (
			<li key={audit.name}>{audit.name}</li>
		);
		return auditInfo;
	}

	// This only starts the request for now, it does not get a response
	runAudit() {
		let auditRequest = new Request('/run/audit', {method: 'POST', credentials: 'same-origin'});
		fetch(auditRequest).then((response) => response.json()).then((response) => {
			console.log('The audit is donion-rings', response);
		});
	}

	renderAuditHistory() {
		if (this.state.auditInitialized) {
			let temp = this.state.auditHistory.slice();
			if (this.state.auditHistory) {
				temp.push(<button key="btn" className="btn" onClick={this.runAudit} style={{marginTop:'15px'}}>Run Another Audit</button>);
			}
			const exists = (
				<div className="content-section">
					<p>Your most recent audit</p>
					<ul>
						{this.state.auditHistory.length ? temp : '...' }
					</ul>
				</div>
			);
			return exists;
		} else {
			const notExists = (
				<div className="content-section">
					<p>You have not run any audits yet!</p>
					<button className="btn" onClick={this.runAudit}>Run Audit</button>
				</div>
			);
			return notExists;
		}
	}

	retrieveCourseHistory() {
		if (this.state.courseInitialized) {
			let courseList = [];
			let maxHist = 3;
			let hist = 0;
			for (let course in this.state.courses) {
				if (this.state.courses.hasOwnProperty(course) && hist < maxHist) {
					courseList.push(this.renderCourse(this.state.courses[course]));
					hist ++;
				}
			}
			this.setState({
				courseHistory: courseList,
			});
		}
	}

	renderCourse(course) {
		const courseInfo = (
			<li key={course.slugName}>{course.name}</li>
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

	updatePieChart(){
		let oldChartData = this.state.chartData;
		let dashboardRef = this;
		FirebaseActions.getCreditsTaken(cookie.load('TOKEN'), function(credsTaken){
			FirebaseActions.getTotalCredits(function(credsTotal){
				let credsRemaining = credsTotal - credsTaken;
				oldChartData.datasets[0].data[0] = credsTaken;
				if(credsRemaining<0){
					oldChartData.datasets[0].data[1] = 0;
				}else{
					oldChartData.datasets[0].data[1] = credsRemaining;
				}
				dashboardRef.setState({
					chartClass: '',
					chartData: oldChartData
				});

			});
		});
	}

	render() {
		return (
			<div>
				<div>
					<div className="row center-align">
						<div className="col l8 m8 s12">
							<div className="information-panel">
								<h2>Overall Degree Completion</h2>
								<div className="row center-align">
									<div className={/*'col l6 offset-l3 m10 offset-m1 ' +*/ this.state.chartClass}>
										<Pie data={this.state.chartData} options={this.state.chartOptions} redraw/>
									</div>
								</div>
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
									{this.renderAuditHistory()}
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
