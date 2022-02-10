import { getdivisions, getproducts, getemployees, assignemployees, settaon, settaoff } from "/libraries/corp.js";


/** @param {NS} ns **/
export async function main(ns) {
	//ns.disableLog('ALL');
	ns.disableLog('sleep');
	ns.clearLog();

	let cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"]
	let divisions = getdivisions(ns);


	while (true) {
		await ns.sleep(20);

		divisionloop:
		for (const division of divisions) {
			// set TA to either on of off
			if (ns.corporation.hasResearched(division.name, 'Market-TA.I') && ns.corporation.hasResearched(division.name, 'Market-TA.II')) {
				settaon(ns, division.name);
			}

			let products = getproducts(ns, division.name)

			// if alread working on a product wait by cycling the divisionloop
			for (const product of products) {
				if (product.developmentProgress < 100) {
					continue divisionloop;
				}
			}

			// figure out which product is the worst and retire it
			let worstproduct = products.reduce((min, prod) => min.dmd < prod.dmd ? min : prod);
			ns.corporation.discontinueProduct(division.name, worstproduct.name);

			// create new product in random city
			let newproductname = division.name + "-" + Math.floor(Math.random() * 1000);
			let cityindex = Math.floor(Math.random() * cities.length);
			ns.corporation.makeProduct(division.name, cities[cityindex], newproductname, 1e9, 1e9);
		}
	}
}