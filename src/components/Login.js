import React, { Component } from 'react';
import './style/Login.css';

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
				<p id='quickstart-sign-in-status'>Status</p>
				<p id='quickstart-account-details'>AccountDetails</p>
				<a className='center-object valign btn-large waves-effect waves-light' 
				   onClick={(e) => {e.preventDefault(); this.context.router.transitionTo(`/dashboard`)}}>Login</a>			
				<div className="g-signin2" data-onsuccess="onSignIn" data-theme="dark">Sign In</div>
				<button id='signout'>Sign Me Out!</button>
			</div>
			</div>
		</div>
    );
  }
}

Login.contextTypes = {
	router: React.PropTypes.object
}

export default Login;
