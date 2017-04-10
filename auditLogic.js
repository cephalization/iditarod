exports = module.exports = {};
/* Function(s) for comparing user's courses with degree requirements
 *
 */

/* Compares a user's taken courses with a degree's requirements and returns an
 * object containing lists of classes towards the degree and classes still
 * needed.
 *
 * @param courses An array containing all of courses a user has taken.
 * @param audit An object containing all the requirements of a degree.
 * @return An object containing a list of courses that meet degree requirements
 * and a list of requirements not known to have been met.
 */
exports.compareCoursesToAudit = function(courses, audit)
{
	let ret = {completed: {}, uncompleted: {}};

	for (let key in audit) {
		if (key === 'credits_min') {
			continue;
		}
		ret.completed[key] = [];
		ret.uncompleted[key] = {};
		for (let prop in audit[key]) {
			// Switch on type of info in requirement
			// eg. select_from, CS_XXXX, etc.
			let result = {};
			switch(true) {
			case /select_from.*/.test(prop):
					// TODO
				break;
			case /OR[0-9]+/.test(prop):
					// TODO
				result = checkOr(courses, audit[key][prop]);
				if( result.success === true){
					ret.completed[key] = ret.completed[key].concat(result.out);
				}else{
					ret.uncompleted[key][prop] = audit[key][prop];
				}
				break;
			case /AND[0-9]+/.test(prop):
					// TODO
				result = checkAnd(courses, audit[key][prop]);
				if( result.success === true){
					ret.completed[key] = ret.completed[key].concat(result.out);
				}else{
					ret.uncompleted[key][prop] = audit[key][prop];
				}
				break;
			case /[A-Z][A-Z]+_[0-9]{4}/.test(prop):
					// TODO
				break;
			case /credits_min|min_credits/.test(prop):
					// TODO
				break;
			default:
					// TODO Something must have gone wrong
			}
		}
	}
	return ret;
};
//Returns ret, which has an attribute success, which is true if
//the req is fufilled; out is an array that contains the courses
//that fufilled it.
function checkOr(courses, or_obj){
	let ret = {
		success:false,
		out:[]
	};

	for(let or_course in or_obj){
		//Check if it's a nested AND or OR
		if(/AND[0-9]+/.test(or_course)){
			let result = checkAnd(courses, or_obj[or_course]);
			if(result.success === true){
				ret.success = true;
				ret.out = result.out;
				return ret;
			}
			continue;
		}else if(/OR[0-9]+/.test(or_course)){
			let result = checkOr(courses, or_obj[or_course]);
			if(result.success === true){
				ret.success = true;
				ret.out = result.out;
				return ret;
			}
			continue;
		}
		for(let i = 0;i<courses.length;i++){
			if(courses[i].slugName === or_course){
				ret.success = true;
				ret.out = courses[i];
				return ret;
			}
		}
	}
	return ret;
}
//Returns ret, which has an attribute success, which is true if
//the req is fufilled; out is an array that contains the courses
//that fufilled it.
function checkAnd(courses, and_obj){
	let ret = {
		success:true,
		out:[]
	};
	for(let and_course in and_obj){
		//Check if it's a nested AND or OR
		if(/AND[0-9]+/.test(and_course)){
			let result = checkAnd(courses, and_obj[and_course]);
			if(!result.success){
				ret.success = false;
				//return ret;
			}
			//merge the two arrays
			Array.prototype.push.apply(ret.out, result.out);
			continue;
		}else if(/OR[0-9]+/.test(and_course)){
			let result = checkOr(courses, and_obj[and_course]);
			if(!result){
				ret.success = false;
			}
			//merge arrays
			Array.prototype.push.apply(ret.out, result.out);
			continue;
		}
		let result = courses.find(function(element){
			return element.slugName === and_course;
		});
		if(result !== undefined){
			ret.out.push(result);
		}else{
			ret.success = false;
		}
	}
	return ret;
}
