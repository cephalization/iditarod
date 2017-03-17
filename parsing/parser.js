console.log('starting');

let https = require('https');
const cheerio = require('cheerio');

https.get('https://www.banweb.mtu.edu/pls/owa/stu_ctg_utils.p_online_all_courses_ug', (res) => {
	console.log('readingData');
	let rawData = '';
	res.on('data', (chunk) => rawData += chunk);
	res.on('end', () => parseData(rawData));
}).on('error', (e) => {
	console.log('error' + e);
});

function parseData(rawData)
{
	let $ = cheerio.load(rawData);

	//console.log($('#content').find('b').text());
	let classes = $('#content');
	classes.children().remove('table').remove('h2').remove('h3').remove('a');
	//console.log(classes.children().first().text());
	//console.log(classes.text());
	//console.log(classes.text());
	let text = classes.text();

	let startPat = /[A-Z][A-Z][A-Z]+ [0-9]{4} - .*\n/;
	console.log(startPat.exec(text)[0]);
}
