import { getdivisions, getproducts, getemployees, assignemployees, setta } from "/libraries/corp.js";


/** @param {NS} ns **/
export async function main(ns) {
	let cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"]
	let divisions = getdivisions(ns);

	// enable market TA for products
	setta(ns);


	// assign employees to jobs
	for (const division of divisions) {
		for (const city of cities) {
			let employees = await getemployees(ns, division.name, city);
			await assignemployees(ns, division.name, city, employees);
		}
	}

	ns.tprint("Completed corporation config.");
}