postData();

function postData() {
	let parser = require('./parser.js');

	parser.getData().then(function(data) {

		let admin = require('firebase-admin');
		let serviceAccount = require('../firebase-credentials.json');
		let app = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: 'https://iditarod-b06d6.firebaseio.com'
		});

		let db = admin.database();
		let ref = db.ref('Courses/');
		console.log('posting data');
		ref.update(data.Courses).then(function () {
				console.log('it ran');
				app.delete();
			});
	});

	return;
}
