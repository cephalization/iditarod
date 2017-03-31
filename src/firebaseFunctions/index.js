import Firebase from 'firebase';

const config = {
	apiKey: 'AIzaSyBbayVYRadLrnczNqIzhwd1X-LwEO7OwxQ',
	authDomain: 'iditarod-b06d6.firebaseapp.com',
	databaseURL: 'https://iditarod-b06d6.firebaseio.com',
};

Firebase.initializeApp(config);
const database = Firebase.database();

//Utility Functions
export function signInUser(googleToken){
	let cred = Firebase.auth.GoogleAuthProvider.credential(googleToken);
	let user = Firebase.auth().signInWithCredential(cred);
	//Check if this is the first sign in (if this user directory exists)
	database.ref('Users').once('value', function(snapshot){
		let curUser = Firebase.auth().currentUser.uid;
		console.log('checked if user ' + curUser + ' existed.');
		if(!snapshot.hasChild(curUser)){
			database.ref('Users/' + curUser).set({'Audits':{initialized:false},
				'Courses':{initialized:false}});

			console.log('User doesn\'t exist, adding.');
		}
	});

	return user;
}

export function getCurrentUser(){
	return Firebase.auth().currentUser;
}

export function isSignedIn(user){
	return user != null && Firebase.auth().currentUser === user;
}

export function signOut(){
	return Firebase.auth().signOut;
}
//Database Functions
//gets allcourses, calls callback with an object, with one property "courses",
//Which contains all courses.
export function allCourses(callback){
	let courses = database.ref('Courses');
	courses.once('value', function (snapshot) {
		callback({
			'courses': snapshot.val()
		});
	});
}

export function userSpace(cookie, callback){
	let cred = Firebase.auth.GoogleAuthProvider.credential(cookie);
	Firebase.auth().signInWithCredential(cred).then(function(user) {
		const uid = user.uid;
		let userCourses = database.ref('Users/' + uid);
		userCourses.once('value', function(snapshot){
			callback({
				'userSpace': snapshot.val()
			});
		});
	});
}
