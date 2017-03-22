import React, {Component} from 'react';

class Dashboard extends Component {

	componentDidMount(){
		console.log(this);
		const props = this.props;
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		props.checkAuth('Dashboard');
	}

	componentWillUnmount() {
		console.log('Dashboard unmounted!');
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

Dashboard.PropTypes = {
	checkAuth: React.PropTypes.func
};

export default Dashboard;
