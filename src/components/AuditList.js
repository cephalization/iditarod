import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';
import {Doughnut} from 'react-chartjs-2';

class AuditList extends Component {

	constructor() {
		super();

		this.updatePieChart = this.updatePieChart.bind(this);
		this.retrieveUserSpace = this.retrieveUserSpace.bind(this);
		this.renderCourse = this.renderCourse.bind(this);
		this.retrieveCourseHistory = this.retrieveCourseHistory.bind(this);
		this.renderCourseHistory = this.renderCourseHistory.bind(this);
		this.retrieveAuditHistory = this.retrieveAuditHistory.bind(this);
		this.renderAuditHistory = this.renderAuditHistory.bind(this);
		this.renderAudit = this.renderAudit.bind(this);

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
		props.checkAuth('AuditList');
		this.retrieveUserSpace();
		this.updatePieChart();
	}

	renderAudit(audit) {
		const auditInfo = (
			<li key={audit.name}>{audit.name}</li>
		);
		return auditInfo;
	}

	runAudit() {
		let auditRequest = new Request('/run/audit', {method: 'POST', credentials: 'same-origin'});
		fetch(auditRequest).then((response) => response.json()).then((response) => {
			console.log('The audit is donion-rings', response);
			if (response.Success) {
				window.location.href=response.auditLink;
			}
		});
	}

	retrieveAuditHistory(){
		if (this.state.auditInitialized) {
			let auditList = [];
			let maxHist = 5;
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

	renderAuditHistory() {
		if (this.state.auditInitialized) {
			let temp = this.state.auditHistory.slice();
			/*if (this.state.auditHistory) {
				temp.push(<button key="btn" className="btn" onClick={this.runAudit} style={{marginTop:'15px'}}>Run Another Audit</button>);
			}*/
			const exists = (
				<div className="content-section">
					<p>Your audits</p>
					<p2>
						{this.state.auditHistory ? temp : '...' }
					</p2>
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

	renderCourse(course) {
		const courseInfo = (
			<li key={course.slugName}>{course.name}</li>
		);
		return courseInfo;
	}

	retrieveCourseHistory() {
		if (this.state.courseInitialized) {
			let courseList = [];
			let maxHist = 100;
			let hist = 0;
			for (let course in this.state.courses) {
				if (this.state.courses.hasOwnProperty(course) && hist < maxHist) {
					courseList.push(this.renderCourse(this.state.courses[course]));
					hist ++;
				}
				this.setState({
					courseHistory: courseList,
				});
			}
		}
	}

	renderCourseHistory() {
		if (this.state.courseInitialized) {
			const exists = (
				<div className="content-section">
					<p1>
						{this.state.courseHistory.length ? this.state.courseHistory : '...' }
					</p1>
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
						<div className="col l6 m8 s12">
							<h3>Completed Credits</h3>
							<div className="information-panel panel-bl">
								<div className="row center-align">
									<div className={this.state.chartClass}>
										<Doughnut data={this.state.chartData} options={this.state.chartOptions} redraw/>
									</div>
								</div>
							</div>
						</div>
						<div className="col l6 m8 s12">
							<h3>Past Audits</h3>
							<div className="information-panel panel-bl">
								{this.renderAuditHistory()}
							</div>
						</div>
						<div className="col l6 m8 s12">
							<h3>Classes Taken</h3>
							<div className="information-panel panel-bl">
								<p2>{this.renderCourseHistory()}</p2>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AuditList.contextTypes = {
	router: React.PropTypes.object
};

AuditList.PropTypes = {
	checkAuth: React.PropTypes.func
};

export default AuditList;
