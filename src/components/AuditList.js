import React, {Component} from 'react';

class AuditList extends Component {
	componentWillMount(){
		this.props.checkAuth("AuditList");
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
