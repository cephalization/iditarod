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
	return Firebase.auth().signInWithCredential(cred);
}

export function getCurrentUser(){
	return Firebase.auth().currentUser;
}

export function isSignedIn(user){
	return user != null && Firebase.auth().currentUser === user;
}

export function signOut(){
	Firebase.auth().signOut;
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
