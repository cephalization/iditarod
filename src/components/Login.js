import React, {Component} from 'react';
import './style/Login.css';
import GoogleLogin from 'react-google-login';

class Login extends Component {
	constructor() {
		super();
		this.responseGoogle = this.responseGoogle.bind(this);
	}

	responseGoogle(response) {
		// Successful response from google
		if (response.googleId) {
			this.context.router.transitionTo('/dashboard');
		}
	}
	/*//Code for the sign out function. Will work once gapi is figured out
	window.onLoadCallback = function signOut(googleUser) {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
		console.log('User signed out.');
		});
	}*/

	render() {
		return (
			<div>
				<div className='intro mtu-yellow-text jet-black-bg'>
					<h1>Iditarod</h1>
					<h2>MTU Course Planner</h2>
				</div>
				<div className='content-section'>
					<div className='valign-wrapper'>
						<GoogleLogin
							clientId="419580728333-lrjvoak9e2kjapl3b6t82nlekrkl3ltq.apps.googleusercontent.com"
							buttonText="Login with MTU Email"
							onSuccess={this.responseGoogle}
							onFailure={this.responseGoogle}
							/>
					</div>
				</div>
			</div>
		);
	}
}


Login.contextTypes = {
	router: React.PropTypes.object
};

export default Login;
