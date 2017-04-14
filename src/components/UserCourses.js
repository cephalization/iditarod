import React, { Component } from 'react';
import './style/Courses.css';

class UserCourses extends Component {

	constructor(props) {
    // Required function call for every constructor
		super(props);

    // Bind every class function to 'this'
    //Set up our state
		this.state = {
			userCourses: [],
			courseInitialized: true
		};
	}

	componentWillReceiveProps(nextProps) {
		let props = this.props;
		let newProps = nextProps;
		if (props !== newProps) {
			this.setState({
				userCourses: newProps.courses,
				courseInitialized: newProps.initialized
			});
		}
	}

	renderUserCourses() {
		if (this.state.courseInitialized) {
			const exists = this.state.userCourses.length ? this.state.userCourses : '...' ;
			return exists;
		} else {
			const notExists = (
				<li>
					<div>
						<p>You have not taken any courses yet.</p>
						<p>Add some with the tool on this page!</p>
					</div>
				</li>
			);
			return notExists;
		}
	}

	render() {
		return (
      <div className="col special-s12 s12 m6 l6">
        <h5 className="s12 special-s12">My Courses</h5>
        <ul className="property-list collapsible" data-collapsible="accordion">
          {this.renderUserCourses()}
        </ul>
      </div>
		);
	}

}

UserCourses.contextTypes = {
	router: React.PropTypes.object
};

UserCourses.PropTypes = {
	courses: React.PropTypes.array,
	initialized: React.PropTypes.bool
};

export default UserCourses;
