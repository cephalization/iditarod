import React, {Component} from 'react';

class Dashboard extends Component {

	componentDidMount(){
		console.log(this);
		const props = this.props;
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		props.checkAuth('Dashboard');
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
									<p>IF courses have not been added, show link to add courses</p>
									<p>ELSE show most recent courses added</p>
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
