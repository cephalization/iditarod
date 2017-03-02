const express = require('express');
const path = require('path');
const app = express();
const firebase = require('firebase-admin');

// Configure Firebase connection information Initialize Firebase
const serviceAccount = require('./firebase-credentials.json');
firebase.initializeApp({
	credential: firebase
		.credential
		.cert(serviceAccount),
	databaseURL: 'https://iditarod-b06d6.firebaseio.com'
});
const database = firebase.database();

// Configure express to listen on localhost, deliver the latest React Build
app.use(express.static('./build'));

app.get('*', function (req, res) {
	
	// Any url that is not an endpoint is just ignored
	// Create endpoints as functions and call them based on the url
	switch (req.path) {
	case '/courses/allCourses':
		getAllCourses(req, res);
		break;

	default:
		res.sendFile(path.join(__dirname, './build', 'index.html'));
		break;
	}
	console.log('We sent the site!');
});

// Endpoints for client retrieval of data
let getAllCourses = function (req, res) {
	console.log('Request sent for course data...');
	// Get all courses
	let courses = database.ref('Courses');
	courses.on('value', function (snapshot) {
		res.send({
			'courses': snapshot.val()
		});
		console.log('Sent data!');
	});
};

app.listen(9000);
