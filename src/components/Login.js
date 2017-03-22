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
		this._isMounted = true;
		//if we're already signed in, route to the dashboard.
		const props = this.props;
		if(props.checkAuth('Login')) {
			this.context.router.transitionTo('/dashboard');
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	responseGoogle(response, props) {
		if (this._isMounted) {
			// Successful response from google, make sure it's a mtu email
			if (response.googleId && response.profileObj.email.endsWith('@mtu.edu')) {
				cookie.save('TOKEN', response.tokenId, {
					expires:new Date(response.tokenObj.expires_at)
				});

				FirebaseActions.signInUser(response.tokenId);
				props.checkAuth('Login');
				this.context.router.transitionTo('/dashboard');
			}else{
				alert('MTU EMAIL: (' + response.profileObj.email.endsWith('@mtu.edu') + ')');
			}
		}
	}

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
							onSuccess={(response) => {this.responseGoogle(response, this.props);}}
							onFailure={(response) => {this.responseGoogle(response, this.props);}}
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

Login.PropTypes = {
	checkAuth: React.PropTypes.func
};

export default Login;
