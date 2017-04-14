import React, {Component} from 'react';

class Audit extends Component {
	constructor(){
		super();
	}
	render() {
		return (
			<div>
				Audit ID: {this.props.AuditID}
			</div>
		);
	}
}

Audit.contextTypes = {
	router: React.PropTypes.func.isRequired
};

Audit.propTypes = {
	AuditID: React.PropTypes.string.isRequired,
	checkAuth: React.PropTypes.func
};

export default Audit;
