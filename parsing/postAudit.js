let admin = require('firebase-admin');
let serviceAccount = require('../firebase-credentials.json');
let app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://iditarod-b06d6.firebaseio.com'
});
let audit = require('./degreeLayout.json');
let db = admin.database();
let ref = db.ref('Audits/');
console.log('beginning upload');
ref.update(audit.Audits).then(function() {
	console.log('upload complete');
	app.delete();
});
