const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// Configure express to serve files from the build folder
app.use(express.static('./build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Intercept all URLs, switch on URL
app.get('*', function (req, res) {
	// Create endpoints as functions and call them based on the url
	console.log('Get request caught for', req.path);
	switch (req.path) {
// Just deliver the index if the url is not a data endpoint
	default:
		res.sendFile(path.join(__dirname, './build', 'index.html'));
		break;
	}
	console.log('We sent the site!');
});

/*
 * Post requests
 */
app.post('*', function(req, res){
	console.log('Post request caught for', req.path);
	switch(req.path){
	case '/run/audit':
		generateAudit(req);
		break;
	default:
		res.sendFile(path.join(__dirname, './build', 'index.html'));
		break;
	}
});

// Request contains
// .uid = user's uid on the database
// .type = degree to run audit on
// .requirementsMet = object that contains fulfilled HASS and select_from
function generateAudit(request) {

	// Loading relevant user information from firebase
	// User's taken courses, credits taken

	// Load degree audit requirements from firebases

	// Create a user audit object
	// it will have a property for each requirement
	// each requirement will have a property for courses taken fulfilling this property, courses yet to be taken, credits completed for requirement
	// Parse degree audit per pseudo specs, save results in user audit object

	// Save a completed audit to the database
}

// Endpoints for client retrieval of data

app.listen(9000);
