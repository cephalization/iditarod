import React, {Component} from 'react';
import './style/Login.css';
<meta name="google-signin-client_id" content="419580728333-lrjvoak9e2kjapl3b6t82nlekrkl3ltq.apps.googleusercontent.com"></meta>

class Login extends Component {
    render() {
	return (
		<div>
		<div className='intro mtu-yellow-text jet-black-bg'>
		<h1>Iditarod</h1>
		<h2>MTU Course Planner</h2>
		</div>
		<div className='content-section'>
		<div className='valign-wrapper'>
		
		<script src="https://apis.google.com/js/platform.js" async defer></script>
		<a
		className="g-signin2" data-onSuccess= "onSignIn()"
		onClick={(e) => {
			e.preventDefault();
			onSignIn();
			this
			.context
			.router
			.transitionTo('/dashboard');
		    }}></a>
		<a href="#" onClick="signOut()">Sign Out</a>
		</div>
		</div>
		<p id='quickstart-sign-in-status'>status</p>
		</div>
		);
    }
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
/*
 window.onLoadCallback = function signOut(googleUser) {
    //var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }*/

Login.contextTypes = {
    router: React.PropTypes.object
};

export default Login;