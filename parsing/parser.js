/* To use this module call getData, and then use .then to get the data into a
 * function. That is, getData returns a promise which will either return the
 * desired json or an error.
 *
 * For an example that logs the result see testParser.js
 */

/* Stuff that needs to be parsed out:
 * name
 * description
 * credits
 * lec-rec-lab
 * semesters offered
 * restrictions
 * pre-reqs
 * co-reqs
 */

module.exports = {
	getData: getData
}

function getData() {

	process.on('unhandledRejection', console.log.bind(console));

	console.log('starting');

	let https = require('https');

	let promise = new Promise(function(resolve, reject) {

	https.get('https://www.banweb.mtu.edu/pls/owa/stu_ctg_utils.p_online_all_courses_ug', (res) => {
		console.log('readingData');
		let rawData = '';
		res.on('data', (chunk) => rawData += chunk);
		res.on('end', () => resolve(parseData(rawData)));

	}).on('error', (e) => {
		reject(e);
	});

	});

	return promise;
}


function parseData(rawData)
{
	console.log('processing data');

	let cheerio = require('cheerio');
	let $ = cheerio.load(rawData);

	let classes = $('#content');
	classes.children().remove('table').remove('h2').remove('h3').remove('a');
	let text = classes.text().trimLeft();

	let startPat = /([A-Z][A-Z]+ [0-9]{4} - .*\n)/;

	let strings = text.split(startPat);
	strings.shift();

	let ret = {Courses: {}};

	for (let i = 0; i < strings.length; i += 2) {
		let classNumRegExp = /[A-Z][A-Z]+ [0-9]{4}/;
		let classNum = classNumRegExp.exec(strings[i + 0])[0];
		classNumSP = classNum.replace(' ', '_');
		ret.Courses[classNumSP] = {};
		ret.Courses[classNumSP].slugName = classNumSP;
		ret.Courses[classNumSP].prettyClassNum = classNum;
		let department = classNumSP.split('_')[0];
		ret.Courses[classNumSP].department = department;

		let classNameRegExp = /- (.*)\n/;
		let className = classNameRegExp.exec(strings[i])[1];
		ret.Courses[classNumSP].name = className;

		let descRegExp = /Credits/;
		let description = strings[i + 1].split(descRegExp)[0].trimRight();
		ret.Courses[classNumSP].description = description;

		let creditsRegExp = /Credits:\s*(\d\.\d)/;
		let numRegExp = /\d\.\d/;
		let credits = null;
		try {
			credits = creditsRegExp.exec(strings[i + 1])[1];
		} catch (e) {
			credits = strings[i + 1].split(/Credits: /)[1].split('Semester')[0].replace(/\s+/g, ' ').trim();
		}
		ret.Courses[classNumSP].credits = credits;

		let recLecLabRegExp = /Lec-Rec-Lab: \((.*)\)/;
		try {
			let recLecLab = recLecLabRegExp.exec(strings[i + 1])[1];
			ret.Courses[classNumSP].lecreclab = recLecLab;
		} catch (e) {
		}

		let semestersRegExp = /Semesters Offered: .*\n/;
		let semesters = semestersRegExp.exec(strings[i + 1])[0].replace('Semesters Offered: ', '').trim();
		ret.Courses[classNumSP].semesters = semesters;

		let prereqString = '';
		try {
			let prereqRegExp = /Pre-Requisite\(s\): /;
			prereqString = strings[i + 1].split(prereqRegExp)[1].split('\n')[0];
			ret.Courses[classNumSP].prereqs = prereqString;
		} catch (e) {
		}

		let coreq = '';
		try {
			let coreqRegExp = /Co-Requisite\(s\): /;
			coreq = strings[i+1].split(coreqRegExp)[1].split('\n')[0].trim();
			ret.Courses[classNumSP].coreqs = coreq;
		} catch(e) {

		}

		try {
			let restrictionsRegExp = /Restrictions:\s*(.*)\n/;
			let restrictions = restrictionsRegExp.exec(strings[i + 1])[1];
			ret.Courses[classNumSP].restrictions = restrictions;
		} catch (e) {}
	}

	return ret;
}
