import React, {Component} from 'react';
import logo from '../freehusky.svg';

class NavBar extends Component {
	constructor() {
		super();
	}

	componentDidMount() {
		window.$('.button-collapse').sideNav();
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
							<ul className="right">
								<li><a>Sign Out</a></li>
							</ul>
							<ul className="right hide-on-med-and-down">
								<li><a href="/Dashboard">Dashboard</a></li>
								<li><a href="/Courses">Courses</a></li>
								<li><a href="/stored/audit">Audits</a></li>
							</ul>
						</div>
					</nav>
				</div>
				<ul className="side-nav" id="mobile-nav">
					<li><a href="/Dashboard">Dashboard</a></li>
					<li><a href="/Courses">Courses</a></li>
					<li><a href="/stored/audit">Audits</a></li>
				</ul>
			</div>
		);
	}
}

NavBar.contextTypes = {
	router: React.PropTypes.object
};

export default NavBar;
