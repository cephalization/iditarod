import React, {Component} from 'react';
import * as FirebaseActions from '../firebaseFunctions';
import cookie from 'react-cookie';
import {Collapsible, CollapsibleItem} from 'react-materialize';
class Audit extends Component {
	constructor(props){
		super(props);

		// Bind functions that need 'this'
		this.getAuditRender = this.getAuditRender.bind(this);
		this.loadAudit = this.loadAudit.bind(this);

		// Initialize our state
		this.state={
			audit:{},
			auditLoaded:false
		};
	}

	/*
	* Load the audit being requested via props
	*		This function modifies the state with the audit upon success
	*/
	loadAudit(){
		let thisRef = this;
		FirebaseActions.getAudit(cookie.load('TOKEN'), this.props.AuditID, function(audit){
			thisRef.setState({
				audit:audit,
				auditLoaded:true
			});
		});
	}

	/*
	*	Parse the completed audit and render its results
	*/
	getAuditRender(audit){
		let completed = [];
		let uncompleted = [];

		for(let key in audit.completed){
			if(audit.completed.hasOwnProperty(key)) {
				completed.push(key);
			}
		}

		for(let key in audit.uncompleted){
			if(audit.uncompleted.hasOwnProperty(key)) {
				uncompleted.push(key);
			}
		}
		//Function recursively expands the audit object,
		let expand = function(prefix, object, level){
			let arr = [];
			//For every key-value pair
			for(let obj_key in object){
				//if the current item is an object...
				if(object[obj_key]!=null && typeof object[obj_key] === 'object'){
					//Logic to determine the "pretty name"
					let prettyName = obj_key.replace(/_/g, ' ');
					if(/OR[0-9]+/.test(obj_key) === true){
						prettyName = 'Choose one';
					}else if(/select_from/.test(obj_key)){
						prettyName = 'Select from list';
					}
					//recursively expand, roll into this collapsible element.
					arr.push(
						<div key={prefix+obj_key} className="container">
							<Collapsible accordion={false}>
								<CollapsibleItem header={prettyName} icon="view_list">
								{expand(prefix+obj_key, object[obj_key], level+1)}
								</CollapsibleItem>
							</Collapsible>
						</div>
					);
				}else{
					//If it's not an object, then it's a primitive value.
					//Logic to determine the "pretty name"
					//TODO prettify these low level requitments somehow.
					let prettyName = obj_key.replace(/_/g, ' ');
					if(/[A-Z][A-Z]+_[0-9]{4}/.test(obj_key)){
						arr.push(
							<div key={prefix + obj_key} className="low-level-req">
								<p className="center">{object[obj_key]}</p>
							</div>
						);
					}else{
						if(/credits_min|min_credits/.test(obj_key)){
							prettyName = 'Minimum credits needed';
						}
						arr.push(
							<div key={prefix + obj_key} className="low-level-req">
								<p className="center">{prettyName + ': ' + object[obj_key]}</p>
							</div>
						);
					}
				}
			}
			return (<div key={prefix + 'child'}>{arr}</div>);
		};

		completed = completed.map(function(key){
			return (
				<div key={key} className="container">
					<Collapsible accordion={false} className="top-level-req">
						<CollapsibleItem header={key.replace(/_/g, ' ')} icon="view_list">
							{expand(key, audit.completed[key], 2)}
						</CollapsibleItem>
					</Collapsible>
				</div>
			);
		});

		uncompleted = uncompleted.map(function(key){
			return (
				<div key={key} className="container">
					<Collapsible accordion={false}  className="top-level-req">
						<CollapsibleItem header={key.replace(/_/g, ' ')} icon="view_list">
							{expand(key, audit.uncompleted[key], 2)}
						</CollapsibleItem>
					</Collapsible>
				</div>
			);
		});

		return (
			<div>
				{audit.completed === null || audit.completed === undefined || Object.keys(audit.completed).length === 0 ?
					(<p>No completed courses count towards your degree!</p>):
					(
					<div className="completed-requirements">
						<p className="center">Completed:</p>
						{completed}
						<div className="divider"></div>
					</div>
					)}
				{audit.completed === null || audit.completed === undefined || Object.keys(audit.completed).length === 0 ?
					(<p>You're set to graduate!</p>):
					(

				<div className="uncompleted-requirements">
					<p className="center">Uncompleted:</p>
					{uncompleted}
				</div>
				)}
			</div>
		);
	}

	// On mount of the component, load the audit and check authentication
	componentDidMount(){
		const props = this.props;
		//if we're not signed in, then we need to re-auth, or redirect to the login page.
		props.checkAuth('Audit');
		this.loadAudit();
	}

	// Render all JSX
	render() {
		if(this.state.audit === null){
			return (
				<div>
					<h1>Invalid audit ID</h1>
				</div>
			);
		}else if(this.state.auditLoaded){
			return (
				<div>
					<div className="jet-black-bg mtu-yellow-text banner">
						{/* The percentage and text should change dynamically. Just use credits. */}
						<h1>You are {Math.round((this.state.audit.takenCredits / this.state.audit.neededCredits)*100)}% complete with <br /> your degree, awesome!</h1>
						<div className="container row mtu-yellow-text">
							<div className="col m6 l6 s12">
								<h2><i className="material-icons large">done_all</i> You have taken {this.state.audit.takenCourses.length} classes!</h2>
							</div>
							<div className="col m6 l6 s12">
								<h2><i className="material-icons large">trending_up</i> You have completed {Object.keys(this.state.audit.completed).length} requirements!</h2>
							</div>
						</div>
					</div>
					<div>
					</div>
					<div>
						{this.getAuditRender(this.state.audit)}
					</div>
				</div>
			);
		}else{
			return (
				<div className="container">
					<div className="row">
						<h4>Generating your degree audit...</h4>
					</div>
				</div>
			);
		}
	}
}

Audit.propTypes = {
	AuditID: React.PropTypes.string.isRequired,
	checkAuth: React.PropTypes.func
};

export default Audit;
