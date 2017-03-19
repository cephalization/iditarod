// Import libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match, Miss} from 'react-router';
import cookie from 'react-cookie';
import * as FirebaseActions from './firebaseFunctions';

// Import components
import NavBar from './components/NavBar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import CreateAudit from './components/CreateAudit';
import AuditList from './components/AuditList';
import Audit from './components/Audit';
import NotFound from './components/NotFound';

// Import Stylesheet
import './index.css';
import 'materialize-css/bin/materialize.css';

class RootComponent extends React.Component {
	constructor() {
		super();
		this.checkAuthentication = this.checkAuthentication.bind(this);
		this.state = {
			signedIn : false
		};
	}

	checkAuthentication(location) {
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		console.log('checkAuthentication triggered from', location);
		if(FirebaseActions.getCurrentUser() === null){
			console.log('firebase user authentication does not exist');
			let googCook = cookie.load('TOKEN', true);
			if(googCook) {
				console.log('google token exists, refreshing firebase token');
				FirebaseActions.signInUser(googCook);
				if (!this.state.signedIn) {
					this.setState({signedIn:true});
				}
				return true;
			}else{
				console.log('google token does not exist, user must log in again');
				if (this.setState.signedIn) {
					this.setState({signedIn:false});
				}
				console.log('Location is', window.location);
				if (window.location.pathname !== '/') {
					console.log('reroute required');
					window.location.href = '/';
				}
				return false;
			}
		} else {
			if (!this.state.signedIn) {
				this.setState({signedIn:true});
			}
			return true;
		}
	}

	// componentWillMount() {
	// 	this.checkAuthentication('NavBar');
	// }

	render () {
		console.log(Match);
		return (
			<div>
				<NavBar signedIn={this.state.signedIn} />
				<BrowserRouter>
					<div>
						<Match exactly pattern="/" render={() => <Login checkAuth={this.checkAuthentication} />} />
						<Match exactly pattern="/dashboard" render={() => <Dashboard checkAuth={this.checkAuthentication} />} />
						<Match exactly pattern="/courses" render={() => <Courses checkAuth={this.checkAuthentication} />} />
						<Match exactly pattern="/new/audit" render={() => <CreateAudit checkAuth={this.checkAuthentication} />} />
						<Match exactly pattern="/stored/audit" render={() => <AuditList checkAuth={this.checkAuthentication} />} />
						<Match exactly pattern="/audit/:AuditID" render={() => <Audit checkAuth={this.checkAuthentication} />} />
						<Miss component={NotFound} />
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

ReactDOM.render(
  <RootComponent />,
  document.getElementById('root')
);
