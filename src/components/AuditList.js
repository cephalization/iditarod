import React, {Component} from 'react';
import cookie from 'react-cookie';
import * as FirebaseActions from '../firebaseFunctions';

class AuditList extends Component {
	componentWillMount(){
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		if(FirebaseActions.getCurrentUser() === null){
			let googCook = cookie.load('TOKEN', true);
			if(googCook) {
				FirebaseActions.signInUser(googCook);
			}else{
				this.context.router.transitionTo('/');
			}
		}
	}

	render() {
		return (
			<div>
				<div>
						<h3>AuditList Component!</h3>
				</div>
			</div>
		);
	}
}

AuditList.contextTypes = {
	router: React.PropTypes.object
};

export default AuditList;
