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

	//console.log($('#content').find('b').text());
	let classes = $('#content');
	classes.children().remove('table').remove('h2').remove('h3').remove('a');
	//console.log(classes.children().first().text());
	//console.log(classes.text());
	//console.log(classes.text());
	let text = classes.text().trimLeft();

	let startPat = /([A-Z][A-Z]+ [0-9]{4} - .*\n)/;

	let strings = text.split(startPat);
	strings.shift();

	/*for (let i = 0; i < 5 && strings.length >= 5; i++) {
		console.log(strings[i] + "\n");
	}*/

	let ret = {Courses: {}};

	for (let i = 0; i < strings.length; i += 2) {
		let classNumRegExp = /[A-Z][A-Z]+ [0-9]{4}/;
		let classNum = classNumRegExp.exec(strings[i + 0])[0];
		classNumSP = classNum.replace(' ', '_');
		//console.log(classNum);
		ret.Courses[classNumSP] = {};

		let classNameRegExp = /- (.*)\n/;
		let className = classNameRegExp.exec(strings[i])[1];
		//console.log(className);
		ret.Courses[classNumSP].name = className;

		let descRegExp = /Credits/;
		let description = strings[i + 1].split(descRegExp)[0].trimRight();
		//console.log(description);
		ret.Courses[classNumSP].description = description;
		//console.log(description);

		let creditsRegExp = /Credits:\s*(\d\.\d)/;
		let numRegExp = /\d\.\d/;
		let credits = null;
		try {
			credits = creditsRegExp.exec(strings[i + 1])[1];
			//console.log(credits);
		} catch (e) {
			//console.log(e);
			//console.log('i: ' + i);
			credits = strings[i + 1].split(/Credits: /)[1].split('Semester')[0].replace(/\s+/g, ' ').trim();
			//console.log(credits);
		}
		ret.Courses[classNumSP].credits = credits;

		let recLecLabRegExp = /Lec-Rec-Lab: \((.*)\)/;
		try {
			let recLecLab = recLecLabRegExp.exec(strings[i + 1])[1];
			//console.log(recLecLab);
			ret.Courses[classNumSP].lecreclab = recLecLab;
		} catch (e) {
		}
		//let lecRegExp = /\(\d-/
		//let lec = parseInt(lecRegExp.exec(recLecLab)[0].substr(1,1));
		//console.log(lec);

		//let recRegExp = /-\d-/;
		//let rec = parseInt(recRegExp.exec(recLecLab)[0].substr(1,1));
		//console.log(rec);

		//let labRegExp = /-\d\)/;
		//let lab = parseInt(labRegExp.exec(recLecLab)[0].substr(1,1));
		//console.log(lab);

		let semestersRegExp = /Semesters Offered: .*\n/;
		let semesters = semestersRegExp.exec(strings[i + 1])[0].replace('Semesters Offered: ', '');
		//console.log(semesters);
		ret.Courses[classNumSP].semesters = semesters;

		try {
			let prereqRegExp = /Pre-Requisite\(s\): /;
			//console.log(strings[i + 1].search(prereqRegExp));
			let prereqString = strings[i + 1].split(prereqRegExp)[1].split('\n')[0];
			//console.log(prereqString);
			/* TODO Parse out pre-reqs, for now just put them all in a string
			while (let coreqOrsRes = /\(.*\)/.exec(prereqString) != null) {
				while
			}
			*/
			ret.Courses[ClassNumSP].prereqs = prereqString;
		} catch (e) {
			//console.log(e);
			//console.log('i: ' + i);
			//return;
		}

		try {
			let coreqRegExp = /Co-Requisite\(s\): /;
			let coreq = strings[i+1].split(coreqRegExp)[1].split('\n')[0].trim();
			//console.log(coreq);
			ret.Courses[classNumSP].coreqs = coreq;
		} catch(e) {

		}

		try {
			let restrictionsRegExp = /Restrictions:\s*(.*)\n/;
			let restrictions = restrictionsRegExp.exec(strings[i + 1])[1];
			//console.log(restrictions);
			ret.Courses[classNumSP].restrictions = restrictions;
		} catch (e) {}
	}

	//console.log(ret);
	return ret;
}
