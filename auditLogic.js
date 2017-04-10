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

		for (let prop in audit[key]) {
			// Switch on type of info in requirement
			// eg. select_from, CS_XXXX, etc.
			switch(true) {
			case /select_from.*/.test(prop):
					// TODO
				break;
			case /OR[0-9]+/.test(prop):
					// TODO
				break;
			case /AND[0-9]+/.test(prop):
					// TODO
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
}
