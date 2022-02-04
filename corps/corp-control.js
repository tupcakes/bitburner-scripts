import { getdivisions, getproducts, getemployees, assignemployees } from "/libraries/corp.js";


/** @param {NS} ns **/
export async function main(ns) {
	let cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"]
	let divisions = getdivisions(ns);

	// enable market TA for products
	for (const division of divisions) {
		let products = getproducts(ns, division.name)
		for (const product of products) {
			ns.corporation.setProductMarketTA1(division.name, product.name, 'on');
			ns.corporation.setProductMarketTA2(division.name, product.name, 'on');
		}
	}


	// assign employees to jobs
	for (const division of divisions) {
		for (const city of cities) {
			let employees = await getemployees(ns, division.name, city);
			await assignemployees(ns, division.name, city, employees);
		}
	}
}