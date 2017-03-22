import React, {Component} from 'react';

class AuditList extends Component {
	componentDidMount(){
		const props = this.props;
		props.checkAuth('AuditList');
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

AuditList.PropTypes = {
	checkAuth: React.PropTypes.func
};

export default AuditList;
