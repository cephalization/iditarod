import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';
import logo from '../freehusky.svg';

class NavBar extends Component {
	constructor() {
		super();
		this.signOut = this.signOut.bind(this);
		this.renderSignOut = this.renderSignOut.bind(this);
		this.renderSideNav = this.renderSideNav.bind(this);
	}

	componentDidMount() {
		window.$('.button-collapse').sideNav();
	}

	signOut() {
		// signout user from firebase
		FirebaseActions.signOut();
		// delete their auth cookie
		cookie.remove('TOKEN');
		// transition the user
		window.location.href='/';
	}

	renderSignOut() {
		const signOutButton = (
		<ul className="right">
						<li>
							<a href="#"
								onClick={(e) => {e.preventDefault(); this.signOut();}}>
								Sign Out
							</a>
						</li>
		</ul>);
		if (this.props.signedIn) {
			return signOutButton;
		} else {
			return;
		}
	}

	renderSideNav() {
		const sideNav = (
			<ul className="side-nav" id="mobile-nav">
				<li><a href="/Dashboard">Dashboard</a></li>
				<li><a href="/Courses">Courses</a></li>
				<li><a href="/stored/audit">Audits</a></li>
			</ul>
		);
		if (this.props.signedIn) {
			return sideNav;
		} else {
			return (
				<ul className="side-nav" id="mobile-nav">
					<li><a>Please Sign In!</a></li>
				</ul>
			);
		}
	}

	// TODO:
	// Change links available on the navbar based on auth status of user
	render() {
		return (
			<div>
				<div className="navbar-fixed">
					<nav className="jet-black-bg">
						<div className="nav-wrapper mtu-yellow-text">
							<a href="#"
								data-activates="mobile-nav"
								className="button-collapse"
								onClick={(e) => {e.preventDefault();}}>
								<i className="material-icons">menu</i>
							</a>
							<a href="/" className="brand-logo"><img src={logo} alt="logo"/></a>
							{this.renderSignOut()}
							<ul className="right hide-on-med-and-down">
								<li><a href="/Dashboard">Dashboard</a></li>
								<li><a href="/Courses">Courses</a></li>
								<li><a href="/stored/audit">Audits</a></li>
							</ul>
						</div>
					</nav>
				</div>
				{this.renderSideNav()}
			</div>
		);
	}
}

NavBar.contextTypes = {
	router: React.PropTypes.object
};

export default NavBar;
