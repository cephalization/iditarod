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
				<div className="container">
					<div className="row">
						<div className="col l8">
							<div className="information-panel panel-lg">
								Dashboard main panel
							</div>
						</div>
						<div className="col l4">
							<div className="row">
								<div className="information-panel panel-sm">
									Dashboard side panel top
								</div>
							</div>
							<div className="row">
								<div className="information-panel panel-sm">
									Dashboard side panel bottom
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
