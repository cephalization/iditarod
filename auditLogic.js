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
		ret.completed[key] = {};
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
				result = checkOr(courses, audit[key][prop]);
				if( result.completed === true){
					ret.completed[key][prop] = result.completedItems;
				}else{
					ret.uncompleted[key][prop] = audit[key][prop];
				}
				break;
			case /AND[0-9]+/.test(prop):
				result = checkAnd(courses, audit[key][prop]);
				if( result.completed === true){
					ret.completed[key][prop] = result.completedItems;
				}else{
					ret.uncompleted[key][prop] = audit[key][prop];
				}
				break;
			case /[A-Z][A-Z]+_[0-9]{4}/.test(prop):
				if (checkExactCourse(courses, prop)) {
					ret.completed[key][prop] = audit[key][prop];
				} else {
					ret.uncompleted[key][prop] = audit[key][prop];
				}
				break;
			case /credits_min|min_credits/.test(prop):
				// TODO
				break;
			case /HASS/.test(prop):
				// TODO
				break;
			default:
				// TODO Something must have gone wrong
			}
		}
	}
	return ret;
};

function checkExactCourse(courses, course)
{
	for (let courseI in courses) {
		if (courses[courseI].slugName === course) {
			return true;
		}
	}
	return false;
};

//Returns ret, which has an attribute completed, which is true if
//the req is fufilled; completedItems is an array that contains the courses
//that fufilled it.
function checkOr(courses, or_obj){
	let ret = {
		completed:false,
		completedItems:[]
	};

	for(let or_course in or_obj){
		//Check if it's a nested AND or OR
		let result;
		switch(true){
		case /AND[0-9]+/.test(or_course):
			result = checkAnd(courses, or_obj[or_course]);
			if(result.completed === true){
				ret.completed = true;
				ret.completedItems = result.completedItems;
				return ret;
			}
			break;
		case (/OR[0-9]+/.test(or_course)):
			result = checkOr(courses, or_obj[or_course]);
			if(result.completed === true){
				ret.completed = true;
				ret.completedItems = result.completedItems;
				return ret;
			}
			break;
		default:
			for(let i = 0;i<courses.length;i++){
				if(courses[i].slugName === or_course){
					ret.completed = true;
					ret.completedItems = courses[i];
					return ret;
				}
			}
		}
	}
	return ret;
}
//Returns ret, which has an attribute completed, which is true if
//the req is fufilled; completedItems is an array that contains the courses
//that fufilled it.
function checkAnd(courses, and_obj){
	let ret = {
		completed:true,
		completedItems:[]
	};
	for(let and_course in and_obj){
		let result;
		//Check if it's a nested AND or OR
		switch(true){
		case /AND[0-9]+/.test(and_course):
			result = checkAnd(courses, and_obj[and_course]);
			if(!result.completed){
				ret.completed = false;
			}
			//merge the two arrays
			Array.prototype.push.apply(ret.completedItems, result.completedItems);
			break;
		case /OR[0-9]+/.test(and_course):
			result = checkOr(courses, and_obj[and_course]);
			if(!result){
				ret.completed = false;
			}
			//merge arrays
			Array.prototype.push.apply(ret.completedItems, result.completedItems);
			break;
		default:
			result = courses.find(function(element){
				return element.slugName === and_course;
			});
			if(result !== undefined){
				ret.completedItems.push(result);
			}else{
				ret.completed = false;
			}
		}
	}
	return ret;
}
