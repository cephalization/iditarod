// Import libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match, Miss} from 'react-router'

// Import components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import CreateAudit from './components/CreateAudit';
import AuditList from './components/AuditList';
import Audit from './components/Audit';
import NotFound from './components/NotFound';


// Import Stylesheet
import './index.css';

const RootComponent = () => {
	return (
		<BrowserRouter>
			<div>
				<Match exactly pattern="/" component={Login} />
				<Match exactly pattern="/dashboard" component={Dashboard} />
				<Match exactly pattern="/courses" component={Courses} />
				<Match exactly pattern="/new/audit" component={CreateAudit} />
				<Match exactly pattern="/stored/audit" component={AuditList} />
				<Match exactly pattern="/audit/:AuditID" component={Audit} />
				<Miss component={NotFound} />
			</div>
		</BrowserRouter>
	);
}

ReactDOM.render(
  <RootComponent />,
  document.getElementById('root')
);
