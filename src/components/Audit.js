import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';

class Audit extends Component {
	constructor(props){
		super(props);

		this.getAuditRender = this.getAuditRender.bind(this);
		this.loadAudit = this.loadAudit.bind(this);

		this.state={
			audit:{}
		};
	}

	loadAudit(){
		let thisRef = this;
		FirebaseActions.getAudit(cookie.load('TOKEN'), this.props.AuditID, function(audit){
			thisRef.setState({
				audit:audit
			});
		});
	}

	getAuditRender(audit){
		let completed = [];
		let uncompleted = [];

		for(let key in audit.completed){
			completed.push(key);
		}

		for(let key in audit.uncompleted){
			uncompleted.push(key);
		}

		let expand = function(prefix, object, level){
			let arr = [];
			for(let obj_key in object){
				if(object[obj_key]!=null && typeof object[obj_key] === 'object'){
					arr.push(<div key={prefix + obj_key} className="mid-level-req"><p style={{paddingLeft:30*level+'px'}}>{obj_key.replace(/_/g, ' ') + ':'}</p>{expand(prefix+obj_key, object[obj_key], level+1)}</div>);
				}else{
					if(obj_key.replace(/_/g, ' ') === object[obj_key]){
						arr.push(<div key={prefix + obj_key} className="low-level-req"><p style={{paddingLeft:30*level+'px'}}>{object[obj_key]}</p></div>);
					}else{
						arr.push(<div key={prefix + obj_key} className="low-level-req"><p style={{paddingLeft:30*level+'px'}}>{obj_key.replace(/_/g, ' ') + ':' + object[obj_key]}</p></div>);
					}
				}
			}
			return (<div key={prefix + 'child'}>{arr}</div>);
		};

		completed = completed.map(function(key){
			return (<div key={key} className="top-level-req" style={{paddingLeft:30}}><p>{key.replace(/_/g, ' ')}:</p>{expand(key, audit.completed[key], 2)}</div>);
		});

		uncompleted = uncompleted.map(function(key){
			return (<div key={key} className="top-level-req" style={{paddingLeft:30}}><p>{key.replace(/_/g, ' ')}:</p>{expand(key, audit.uncompleted[key], 2)}</div>);
		});

		return (
			<div>
				{audit.completed === null || audit.completed === undefined || Object.keys(audit.completed).length === 0 ?
					(<p>No completed courses count towards your degree!</p>):
					(
					<div className="completed-requirements">
						<p>Completed:</p>
						{completed}
					</div>
					)}
				{audit.completed === null || audit.completed === undefined || Object.keys(audit.completed).length === 0 ?
					(<p>You're set to graduate!</p>):
					(
				<div className="uncompleted-requirements">
					<p>Uncompleted:</p>
					{uncompleted}
				</div>
				)}
			</div>
		);
	}

	componentDidMount(){
		const props = this.props;
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		props.checkAuth('Audit');
		this.loadAudit();
	}

	render() {
		return (
			<div>
				<div>
					Audit ID: {this.props.AuditID}
				</div>
				<div>
					{this.getAuditRender(this.state.audit)}
				</div>
			</div>
		);
	}
}

Audit.propTypes = {
	AuditID: React.PropTypes.string.isRequired,
	checkAuth: React.PropTypes.func
};

export default Audit;
