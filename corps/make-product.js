import { getproducts } from "/libraries/corp.js";

/** @param {NS} ns **/
export async function main(ns) {
	let division = ns.args[0];

	let cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
	let products = getproducts(ns, division);
	let maxproducts = 3;

	// figure out which product is the worst and retire it if we have max products
	if (ns.corporation.hasResearched(division, 'uPgrade: Capacity.I') === true) {
		maxproducts = 4;
	}
	if (products.length === maxproducts) {
		let worstproduct = products.reduce((min, prod) => min.dmd < prod.dmd ? min : prod);
		ns.corporation.discontinueProduct(division, worstproduct.name);
	}

	// create new product in random city and sell it
	let newproductname = division + "-" + Math.floor(Math.random() * 1000);
	let cityindex = Math.floor(Math.random() * cities.length);
	ns.corporation.makeProduct(division, cities[cityindex], newproductname, 1e9, 1e9);
	ns.corporation.sellProduct(division, cities[cityindex], newproductname, 'MAX', 'MP', true);


	// set TA
	if (ns.corporation.hasResearched(division, 'Market-TA.I')) {
		ns.corporation.setProductMarketTA1(division, newproductname, 'on');
	}
	if (ns.corporation.hasResearched(division, 'Market-TA.II')) {
		ns.corporation.setProductMarketTA2(division, newproductname, 'on');
	}
}