console.log("starting");

let https = require('https');

https.get('https://www.banweb.mtu.edu/pls/owa/stu_ctg_utils.p_online_all_courses_ug', (res) => {
	let rawData = '';
	res.on('data', (chunk) => rawData += chunk);
	res.on('end', () => console.log(rawData));
}).on('error', (e) => {
	console.log('error' + e);
});


