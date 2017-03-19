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
	default:
		res.sendFile(path.join(__dirname, './build', 'index.html'));
		break;
	}
});

// Endpoints for client retrieval of data

app.listen(9000);
