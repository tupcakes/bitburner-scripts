import { getdivisions, getemployees, assignemployees } from "/libraries/corp.js";
import { cities } from 'constants.js'


/** @param {NS} ns **/
export async function main(ns) {
	let divisions = getdivisions(ns);

	for (const division of divisions) {
		// // enable TA on products
		// settaon(ns, division.name);

		// assign employees to jobs
		for (const city of cities) {
			// get total possible employees for the city
			let officesize = ns.corporation.getOffice(division.name, city).size;
			let currentemployeecount = ns.corporation.getOffice(division.name, city).employees.length;
			let needtohire = officesize - currentemployeecount;
		
			for (let i = 0; i < needtohire; i++) {
				ns.corporation.hireEmployee(division.name, city);
			}

			let employees = await getemployees(ns, division.name, city);
			await assignemployees(ns, division.name, city, employees);
		}
	}

	ns.tprint("Completed corporation config.");
}