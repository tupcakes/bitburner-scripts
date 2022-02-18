import { getdivisions, getproducts, makeproducts, getemployees, assignemployees, settaon, settaoff } from "/libraries/corp.js";


/** @param {NS} ns **/
export async function main(ns) {
	//ns.disableLog('ALL');
	ns.disableLog('sleep');
	ns.clearLog();

	let cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
	let divisions = getdivisions(ns);


	while (true) {
		await ns.sleep(20);

		divisionloop:
		for (const division of divisions) {
			// // set TA to either on of off
			// if (ns.corporation.hasResearched(division.name, 'Market-TA.I') && ns.corporation.hasResearched(division.name, 'Market-TA.II')) {
			// 	settaon(ns, division.name);
			// }

			let products = getproducts(ns, division.name)

			// if alread working on a product wait by cycling the divisionloop
			for (const product of products) {
				if (product.developmentProgress < 100) {
					continue divisionloop;
				}
			}

			// create new product
			makeproducts(ns, division.name);
		}
	}
}