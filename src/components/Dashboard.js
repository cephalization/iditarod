import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';

class Dashboard extends Component {
	constructor() {
		// Required function call for every constructor
		super();
	}

	componentWillMount(){
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		this.props.checkAuth("Dashboard");
	}

	render() {

		return (
			<div>
				<div className="container">
					<h2>Dashboard</h2>
				</div>
			</div>);
	}
}

Dashboard.contextTypes = {
	router: React.PropTypes.object
};

export default Dashboard;
