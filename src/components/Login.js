import React, {Component} from 'react';
import './style/Login.css';

class Login extends Component {
	constructor() {
		super();

		this.onSignIn = this.onSignIn.bind(this);
	}

	onSignIn(googleUser) {
		var profile = googleUser.getBasicProfile();
		console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName());
		console.log('Image URL: ' + profile.getImageUrl());
		console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
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
			<meta name="google-signin-client_id" content="419580728333-lrjvoak9e2kjapl3b6t82nlekrkl3ltq.apps.googleusercontent.com"></meta>;
			<div className='intro mtu-yellow-text jet-black-bg'>
			<h1>Iditarod</h1>
			<h2>MTU Course Planner</h2>
			</div>
			<div className='content-section'>
			<div className='valign-wrapper'>
			
			<script src='https://apis.google.com/js/platform.js' async defer></script>
			<a className='g-signin2' data-onSuccess='onSignIn()'
			onClick={(e) => {
				e.preventDefault();
				this.onSignIn();
				this
				.context
				.router
				.transitionTo('/dashboard');
			}}></a>
			</div>
			<a id='signout' href='#'>Sign Out</a>
			<p id='quickstart-sign-in-status'>Status</p>
			</div>
		</div>
		);
	}
}


Login.contextTypes = {
	router: React.PropTypes.object
};

export default Login;