const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require ('cookie-parser');
const Firebase = require('firebase');

// Configure and initialize an admin connection to firebase
const config = {
	apiKey: 'AIzaSyBbayVYRadLrnczNqIzhwd1X-LwEO7OwxQ',
	authDomain: 'iditarod-b06d6.firebaseapp.com',
	databaseURL: 'https://iditarod-b06d6.firebaseio.com',
};

Firebase.initializeApp(config);
const database = Firebase.database();

// Configure express to serve files from the build folder
app.use(express.static('./build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());

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
});

/*
 * Post requests
 */
app.post('*', function(req, res){
	console.log('Post request caught for', req.path);
	switch(req.path){
	case '/run/audit':
		generateAudit(req, res);
		break;
	default:
		res.sendFile(path.join(__dirname, './build', 'index.html'));
		break;
	}
});

async function getUserSpace(cookie){
	// Authenticate to the user's data on firebase
	let us = {};
	let cred = Firebase.auth.GoogleAuthProvider.credential(cookie);
	let user = await Firebase.auth().signInWithCredential(cred);
	const uid = user.uid;

	// Return a snapshot of the userSpace
	let userSpace = database.ref('Users/' + uid);
	await userSpace.once('value', function(snapshot){
		us = snapshot.val();
	});
	return us;
}

// Request contains
// cookie that has a token to perform firebase requests
async function generateAudit(request, response) {

	// Loading relevant user information from firebase
	let userID = request.cookies['TOKEN'];
	let userCourses = [];
	let takenCredits = 0;
	let userSpace = null;
	try {
		userSpace = await getUserSpace(userID);
	} catch (err) {
		console.log(err);
		return;
	}
	if (userSpace == null) {
		return;
	}

	// Populating User's taken courses, credits taken
	if (userSpace.Courses.initialized) {
		for (let course in userSpace.Courses) {
			console.log('course is', course);
			if (userSpace.Courses.hasOwnProperty(course) && course !== 'initialized') {
				userCourses.push(userSpace.Courses[course]);
			}
		}
		takenCredits = userSpace.totalCredits;
	} else {
		response.send({error:'The user has not taken any courses yet!'});
		return;
	}
	console.log('The user has taken', userCourses.length, 'courses, for a total of', takenCredits, 'credits');

	// Load degree audit requirements from firebase

	// Create a user audit object
	// it will have a property for each requirement
	// each requirement will have a property for courses taken fulfilling this property, courses yet to be taken, credits completed for requirement
	// Parse degree audit per pseudo specs, save results in user audit object

	// Save a completed audit to the database
}

app.listen(9000);
