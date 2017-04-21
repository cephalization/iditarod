import Firebase from 'firebase';
//firebase credentials.
const config = {
	apiKey: 'AIzaSyBbayVYRadLrnczNqIzhwd1X-LwEO7OwxQ',
	authDomain: 'iditarod-b06d6.firebaseapp.com',
	databaseURL: 'https://iditarod-b06d6.firebaseio.com',
};
//Initialize firebase
Firebase.initializeApp(config);
const database = Firebase.database();

/*
 * Signs the user into our Firebase database.
 *
 * @param googleToken the google ID token for the user to sign in.
 * @return the user info for the current user.
 * See https://firebase.google.com/docs/reference/js/firebase.User for more details on this user object.
 */
export function signInUser(googleToken){
	let cred = Firebase.auth.GoogleAuthProvider.credential(googleToken);
	let user = Firebase.auth().signInWithCredential(cred);
	//Check if this is the first sign in (if this user directory exists)
	database.ref('Users').once('value', function(snapshot){
		//Get the user UID.
		let curUser = Firebase.auth().currentUser.uid;
		console.log('checked if user ' + curUser + ' existed.');
		//Check if the the UID exists in the database
		if(!snapshot.hasChild(curUser)){
			//If it doesn't, then initialize it.
			database.ref('Users/' + curUser).set({'Audits':{initialized:false},
				'Courses':{initialized:false}});
			console.log('User doesn\'t exist, adding.');
		}
	});

	return user;
}
/*
 * Gets the current user.
 */
export function getCurrentUser(){
	return Firebase.auth().currentUser;
}
/*
 * Checks if the particular user is signed in.
 *
 * @param user object of type firebase.User. See https://firebase.google.com/docs/reference/js/firebase.User for more info.
 * @return true if user is signed in, false if this user isn't signed in.
 */
export function isSignedIn(user){
	return user != null && Firebase.auth().currentUser === user;
}
/*
 * Signs out the currently signed in user.
 *
 * @return a promise containing void.
 */
export function signOut(){
	return Firebase.auth().signOut;
}

//Database Functions

/* gets allcourses, calls callback with an object, with one property "courses",
 * Which contains all courses.
 *
 * @param callback a function with a parameter for a javascript object
 * @return void, callback is called with an object that contains all courses.
 */
export function allCourses(callback){
	let courses = database.ref('Courses');
	courses.once('value', function (snapshot) {
		callback({
			'courses': snapshot.val()
		});
	});
}
/*
 * Gets all data under the users ID in the database.
 *
 * @param cookie The userID token used for authentication.
 * @param callback a function with a parameter for a javascript object
 * @return void, calls callback with a javascript object containg all data under the users ID in the database.
 */
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
/*
 * Gets a particular user audit.
 *
 * @param cookie The userID token used for authentication.
 * @param auditid the ID of the audit, which is a date-time string of when the audit was created.
 * @param callback a function with a parameter for a javascript object
 * @return void, calls callback with a javascript object containing the audit.
 */
export function getAudit(cookie, auditid, callback){
	let cred = Firebase.auth.GoogleAuthProvider.credential(cookie);
	Firebase.auth().signInWithCredential(cred).then(function(user) {
		database.ref('Users/'+user.uid+'/Audits/'+auditid).once('value', function(snapshot){
			callback(snapshot.val());
		});
	});
}
/*
 * Adds the given course to the current user.
 * @param cookie The userID token used for authentication.
 * @param course the course object to add.
 * @param callback a function with a parameter for a javascript object
 * @return void, calls callback with a javascript object containing whether the add was Successful or not.
 */
export function addUserCourse(cookie, course, callback) {
	let cred = Firebase.auth.GoogleAuthProvider.credential(cookie);
	Firebase.auth().signInWithCredential(cred).then(function(user) {
		//get user id.
		let uid = user.uid;
		console.log('Users/' + uid + '/Courses/');
		//Get the user courses.
		database.ref('Users/' + uid + '/Courses').once('value', function(snapshot){
			//Initialize courses if not initialized.
			if (!snapshot.val().initialized) {
				database.ref('Users/' + uid + '/Courses/').set({initialized: true});
			}
			//if the course doesn't exist...
			if (!snapshot.hasChild(course.slugName)) {
				let temp = {};
				temp[course.slugName] = course;
				//Upload the coarse.
				database.ref('Users/' + uid + '/Courses/').update(temp);
				//Add the credits (max number if it's variable, the first case).
				if(typeof course.credits === 'string'){
					let parts = course.credits.split(' ');
					addCredits(parseFloat(parts[parts.length-1]), uid);
				}else{
					addCredits(parseInt(course.credits, 10), uid);
				}
				callback({
					Successful: true
				});
			} else {
				callback({
					Successful: false
				});
			}
		});
	});
}
/*
 * Removes the given course to the current user.
 * @param cookie The userID token used for authentication.
 * @param course the course object to remove.
 * @param callback a function with a parameter for a javascript object
 * @return void, calls callback with a javascript object containing whether the
 * removal was Successful or not, as well as whether all courses are removed or not (stillInitialized).
 */
export function removeUserCourse(cookie, course, callback) {
	let cred = Firebase.auth.GoogleAuthProvider.credential(cookie);
	Firebase.auth().signInWithCredential(cred).then(function(user) {
		let uid = user.uid;
		let stillInitialized = true;
		database.ref('Users/' + uid + '/Courses').once('value', function(snapshot){
			if (snapshot.hasChild(course.slugName)) {
				database.ref('Users/' + uid + '/Courses/' + course.slugName).remove();
				console.log('initalized?: ' + snapshot.val().initialized + ' | numChildren = ' + snapshot.numChildren());
				if (snapshot.val().initialized && snapshot.numChildren() <= 2) {
					database.ref('Users/' + uid + '/Courses/').set({initialized: false});
					stillInitialized = false;
				}
				if(typeof course.credits === 'string'){
					let parts = course.credits.split(' ');
					//Note the - sign, adds negative credits, which removes credits.
					addCredits(-parseFloat(parts[parts.length-1]), uid);
				}else{
					addCredits(-parseInt(course.credits, 10), uid);
				}
				callback({
					Successful: true,
					stillInitialized: stillInitialized
				});
			} else {
				callback({
					Successful: false
				});
			}
		});
	});
}
/*
 * Adds the given course to the current user.
 * @param cookie The userID token used for authentication.
 * @param callback a function with a parameter for the number of credits
 * @return void, calls callback with a number indicating how many credits the current user has taken.
 */
export function getCreditsTaken(cookie, callback){
	let cred = Firebase.auth.GoogleAuthProvider.credential(cookie);
	Firebase.auth().signInWithCredential(cred).then(function(user) {
		let uid = user.uid;
		database.ref('Users/' + uid + '/totalCredits').once('value', function(snapshot){
			callback(snapshot.val());
		});
	});
}
/*
 * Gets the total number of credits needed to complete an audit
 *
 * @param callback a function with a parameter for the number of credits
 * @return void, calls callback with a number indicating how many credits the audit needs to be completed.
 */
export function getTotalCredits(callback){
	database.ref('Audits/CompSci-CompSci/credits_min').once('value', function(datasnapshot){
		callback(datasnapshot.val());
	});
}
/*
 * Adds the given amount of credits to the users total credits taken.
 *
 * @param val the amount of credits to add.
 * @param uid the uid of the user to add the credits to.
 * @return void
 */
function addCredits(val, uid){
	database.ref('Users/' + uid).once('value', function(snapshot){
		let numCreds = 0;
		if (snapshot.hasChild('totalCredits')){
			numCreds = snapshot.child('totalCredits').val();
		}
		numCreds+=val;
		database.ref('Users/' + uid + '/totalCredits').set(numCreds);
	});
}
