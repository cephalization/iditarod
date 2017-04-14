const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require ('cookie-parser');
const Firebase = require('firebase');
const Audit = require('./auditLogic');

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

async function getUserSpace(cookie) {
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

async function getAuditRequirements() {
	let audits = database.ref('Audits/');
	let requirements = {};
	await audits.once('value', function(snapshot) {
		requirements = snapshot.child('CompSci-CompSci').val();
	});
	return requirements;
}

async function saveCompletedAudit (cookie, audit) {
	// Authenticate to the user's data on firebase
	let cred = Firebase.auth.GoogleAuthProvider.credential(cookie);
	let user = await Firebase.auth().signInWithCredential(cred);
	const uid = user.uid;

	// Add the new audit to the database
	let userAudits = database.ref('Users/' + uid + '/Audits');
	let dateName = '';
	await userAudits.once('value', function(snapshot) {
		if (!snapshot.val().initialized) {
			database.ref('Users/' + uid + '/Audits/').set({initialized: true});
		}

		// Get the datetime in string form
		let created = new Date();
		created = created.getTime();
		created = new Date(created);

		// Cut the string short and replace spaces and : with _
		created = created.toString().split(' ');
		dateName = created[1] + ' ' + created[2] + ' ' + created[3] + ' ' + created[4];
		dateName = dateName.replace(/:/g,'_');
		dateName = dateName.replace(/ /g,'_');

		// Create a new object with this name
		let temp = {};
		temp[dateName] = audit;
		userAudits.update(temp);
	});
	return dateName;
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
	let auditRequirements = await getAuditRequirements();

	// Run the degree audit with the newly retrieved user information
	let audit = Audit.compareCoursesToAudit(userCourses, auditRequirements);
	audit.takenCredits = takenCredits;

	// Save a completed audit to the database
	let auditName = await saveCompletedAudit(userID, audit);

	// Tell the frontend that we are done calculating the audit
	// We return here so that the function waits on the async functions
	return response.send({
		Success: true,
		Message: 'Audit was saved successfully to the database.',
		auditLink: 'audit/' + auditName
	});
}

app.listen(9000);
