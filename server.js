const express = require('express');
const path = require('path');
const app = express();
const firebase = require('firebase-admin');
const bodyParser = require('body-parser');

// Configure Firebase connection information Initialize Firebase
const serviceAccount = require('./firebase-credentials.json');
firebase.initializeApp({
	credential: firebase
		.credential
		.cert(serviceAccount),
	databaseURL: 'https://iditarod-b06d6.firebaseio.com'
});
const database = firebase.database();

// Configure express to serve files from the build folder
app.use(express.static('./build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Intercept all URLs, switch on URL
app.get('*', function (req, res) {	
	// Create endpoints as functions and call them based on the url
	switch (req.path) {
	case '/courses/allCourses':
		getAllCourses(req, res);
		break;
        
// Just deliver the index if the url is not a data endpoint
	default:
		res.sendFile(path.join(__dirname, './build', 'index.html'));
		break;
	}
	console.log('We sent the site!');
});

/*
 * Requests for firebase data, etc. that is based on the user goes here.
 * req must contain a token in it's query to identify the user. This token is 
 * generated on the client side. See https://firebase.google.com/docs/reference/node/firebase.User#getToken
 * to see how to generate this token. 
 */
app.post('*', function(req, res){
        switch(req.path){
        case '/signIn':
            signIn(req, res);
            break;   
        default:
            res.sendFile(path.join(__dirname, './build', 'index.html'));
	    break;
        }    
});

// Endpoints for client retrieval of data
let getAllCourses = function (req, res) {
	console.log('Requesting course data from Firebase...');

	// Get all courses from firebase
	let courses = database.ref('Courses');
	courses.on('value', function (snapshot) {
		res.send({
			'courses': snapshot.val()
		});
		console.log('Sent data!');
	});
};

/*
 * Test of user token system. Sends the user object back.
 * See this for an example of how to get user info
 * also see https://firebase.google.com/docs/reference/admin/node/admin.auth.UserRecord   
 * for what the user object entails.
 */
let signIn = function (req, res){
        verifyToken(req.body.token).then(function(user){
            res.send('Resolved: ' + JSON.stringify(user));
        }, function(error){
            res.send('Rejected: ' + JSON.stringify(error));
        });
       
};

//verifies a user token, returns a Promise that gives the User if it succeeds.
let verifyToken = function(token){
    return new Promise(function(resolve, reject){
        firebase.auth().verifyIdToken(token)
        .then(function(decodedToken){
              let uid = decodedToken.uid;
              firebase.auth().getUser(uid)
                .then(function(user){
                      resolve(user);
                });
        }).catch(function(error){
               reject(error);
        });
    });
};

app.listen(9000);

