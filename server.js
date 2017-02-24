const express = require('express');
const path = require('path');
const app = express();
const firebase = require('firebase-admin');

// Configure Firebase connection information
// Initialize Firebase
const serviceAccount = require('./firebase-credentials.json');
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://iditarod-b06d6.firebaseio.com"
});

// Configure express to listen on localhost, deliver the latest React Build
app.use(express.static('./build'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
    console.log('We sent the site!');
});

app.listen(9000);

