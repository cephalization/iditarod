import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';
import {Doughnut} from 'react-chartjs-2';

class AuditList extends Component {

	constructor() {
		super();

		// Bind functions that need 'this'
		this.updatePieChart = this.updatePieChart.bind(this);
		this.retrieveUserSpace = this.retrieveUserSpace.bind(this);
		this.renderCourse = this.renderCourse.bind(this);
		this.retrieveCourseHistory = this.retrieveCourseHistory.bind(this);
		this.renderCourseHistory = this.renderCourseHistory.bind(this);
		this.retrieveAuditHistory = this.retrieveAuditHistory.bind(this);
		this.renderAuditHistory = this.renderAuditHistory.bind(this);
		this.renderAudit = this.renderAudit.bind(this);
		this.renderButton = this.renderButton.bind(this);
		this.runAudit = this.runAudit.bind(this);
		this.renderPreview = this.renderPreview.bind(this);

		// Initialize our state
		this.state = {
			courseHistory: [],
			courses: [],
			courseInitialized: true,
			auditHistory: [],
			audits: [],
			auditInitialized: true,
			currentAudit: {},
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

	// On mount of the component, load the audit and check authentication
	componentDidMount(){
		const props = this.props;
		props.checkAuth('AuditList');
		this.retrieveUserSpace();
	}

	/*
	* Return a JSX representation of an audit to be selected in the list
	*/
	renderAudit(audit, selectedAudit) {
		if (selectedAudit == null) {
			selectedAudit = {};
		}
		const auditInfo = (
			<li key={audit.name}>
				<div className="audit-item row" id={
						selectedAudit.name == audit.name ? 'selectedAudit' : 'nonSelectedAudit'
					}>
					<button className="btn btn-flat col s12 m4 l4" onClick={() => {window.location.href = '/audit/' + audit.name;}}>Open Full Audit</button>
					<h5 onClick={() => this.renderPreview(audit)} className="clickable col s12 m8 l8"> {audit.name}</h5>
					<hr/>
				</div>
			</li>
		);
		return auditInfo;
	}

	// This function refreshes all state related to the Audit preview
	renderPreview(audit) {
		this.retrieveAuditHistory(audit);
	}

	// This function requests a new audit, if successful routes to the new audit
	runAudit() {
		let auditRequest = new Request('/run/audit', {method: 'POST', credentials: 'same-origin'});
		fetch(auditRequest).then((response) => response.json()).then((response) => {
			if (response.Success) {
				window.location.href = response.auditLink;
			}
		});
	}

	/*
	*	This function will parse, organize, and convert audits
	*		If no parameters are present, parse all audits, add their rendered states to the state
	*		If a single audit is passed in, only re-render that audit, adding new CSS in the process
	*/
	retrieveAuditHistory(selectedAudit){
		if (this.state.auditInitialized) {
			let auditList = [];
			const maxHist = 1000;
			let thisRef = this;

			//take the info off of the top or selected audit
			let top = {};
			if (selectedAudit != null) {
				auditList = this.state.audits;
				top = selectedAudit;
			} else {
				//reverse the order
				auditList = this.state.audits.reverse();
				//remove all but the most recent ones
				if(auditList.length>maxHist){
					auditList.splice(maxHist);
				}
				top = auditList[0];
			}

			//map to their rendered states.
			auditList=auditList.map((audit)=>(thisRef.renderAudit(audit, top)));

			this.setState({
				auditHistory: auditList,
				currentAudit: top,
				courses: top.takenCourses
			});

			this.updatePieChart(top.takenCredits, top.neededCredits);
			this.retrieveCourseHistory(top.takenCourses);
		}
	}

	// Render the list of audits if they exists, otherwise render the option to run one
	renderAuditHistory() {
		if (this.state.auditInitialized) {
			let temp = this.state.auditHistory.slice();
			const exists = (
				<div className="content-section">
					<ul>
						{this.state.auditHistory ? temp : '...'}
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

	/*
	* Retrieve all user information stored on the database for the current user
	* 	This information is then processed and relevant information is applied to state
	*/
	retrieveUserSpace() {
		let outerThis = this;
		FirebaseActions.userSpace(cookie.load('TOKEN'), function(response){
			let userSpace = response.userSpace;

			// Retrieve the last audit ran
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
					auditInitialized: response.userSpace.Audits.initialized,
					courseInitialized: false
				});
			}
		});
	}

	/*
	* Simply return JSX for a run audit button, this is called if audits exist already
	*/
	renderButton() {
		if (this.state.auditHistory.length) {
			return <button className="btn" onClick={this.runAudit} style={{marginTop:'15px'}}>Run Another Audit</button>;
		}
	}

	/*
	*	Simply return JSX for a given course
	*/
	renderCourse(course) {
		const courseInfo = (
			<li key={course.slugName}>{course.name}</li>
		);
		return courseInfo;
	}

	/*
	* Parse a list of courses, convert them to their rendered JSX states, apply them to state
	*/
	retrieveCourseHistory(courses) {
		if (courses.length) {
			let courseList = [];
			let maxHist = 100;
			let hist = 0;
			for (let course in courses) {
				if (courses.hasOwnProperty(course) && hist < maxHist) {
					courseList.push(this.renderCourse(courses[course]));
					hist ++;
				}
			}
			this.setState({
				courseHistory: courseList,
			});
		} else {
			this.setState({
				courseInitialized: false
			});
		}
	}

	// Return JSX for the list of rendered courses, if they exist
	renderCourseHistory() {
		if (this.state.courseInitialized) {
			const exists = (
				<div className="content-section">
					<ul>
						{this.state.courseHistory.length ? this.state.courseHistory : '...' }
					</ul>
				</div>
			);
			return exists;
		} else {
			const notExists = (
				<div className="content-section">
					<p>You had not taken any courses when this audit was generated!</p>
				</div>
			);
			return notExists;
		}
	}

	// Update the values of the pie chart
	updatePieChart(takenCred, neededCred){
		let oldChartData = this.state.chartData;
		let outerRef = this;
		let credsRemaining = neededCred - takenCred;
		oldChartData.datasets[0].data[0] = takenCred;
		if(credsRemaining<0){
			oldChartData.datasets[0].data[1] = 0;
		}else{
			oldChartData.datasets[0].data[1] = credsRemaining;
		}
		outerRef.setState({
			chartClass: '',
			chartData: oldChartData
		});
	}

	render() {
		return (
			<div>
				<div>
					<div className="row center-align">
						<div className="col l6 m8 s12">
							<div className="information-panel panel-full">
								<h3>Past Audits</h3>
								{this.renderButton()}
								{this.renderAuditHistory()}
							</div>
						</div>
						<div className="col l6 m8 s12">
							<div className="information-panel panel-full">
								<h3>Completed Credits</h3>
								<div className="row center-align">
									<div className={this.state.chartClass}>
										<Doughnut data={this.state.chartData} options={this.state.chartOptions} redraw/>
									</div>
								</div>
								<h3>Classes Taken</h3>
								<div className="row center-align">
									<p2>{this.renderCourseHistory()}</p2>
								</div>
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
