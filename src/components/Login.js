import React, {Component} from 'react';
import GoogleLogin from 'react-google-login';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';
//import GoogleAuth from 'vue-google-auth';
import './style/Login.css';

class Login extends Component {
	constructor() {
		super();
		this.responseGoogle = this.responseGoogle.bind(this);
	}

	componentDidMount(){
		//if we're already signed in, route to the dashboard.
		if(this.props.checkAuth('Login')) {
			this.context.router.transitionTo('/dashboard');
		}
	}

	responseGoogle(response) {
		// Successful response from google, make sure it's a mtu email
		if (response.googleId && response.profileObj.email.endsWith('@mtu.edu')) {
			cookie.save('TOKEN', response.tokenId, {
				expires:new Date(response.tokenObj.expires_at)
			});

			FirebaseActions.signInUser(response.tokenId);
			this.props.checkAuth('Login');
			this.context.router.transitionTo('/dashboard');
		}else{
			alert('MTU EMAIL: (' + response.profileObj.email.endsWith('@mtu.edu') + ')');
		}
	}

	// Code for possible future signin/out
	/*Vue.use(GoogleAuth, { clientID: '419580728333-lrjvoak9e2kjapl3b6t82nlekrkl3ltq.apps.googleusercontent.com'})
	Vue.googleAuth().load()*/

	//Code for the sign out function. Will work once gapi is figured out
	/*signOut(googleUser) {
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
					<div className='intro'>
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
