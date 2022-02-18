/** @param {NS} ns **/
export async function main(ns) {
	let sleevenum = ns.sleeve.getNumSleeves();
	for (let i = 0; i < sleevenum; i++) {
		ns.sleeve.travelToCity('Volhaven');
		ns.sleeve.setToUniversityCourse(i, 'ZB Institute of Technology', 'Study Computer Science');
	}

	ns.universityCourse('Sector-12', 'Study Computer Science', false);


	await ns.sleep(1000);
	if (ns.getPlayer().has4SDataTixApi === false) {
		ns.run('/stocks/early-stock-trader.js');
		ns.tail('/stocks/early-stock-trader.js');
	} else {
		ns.run('/stocks/stock-trader.js');
		ns.tail('/stocks/stock-trader.js');
	}
	ns.run('/stocks/manipulate.js');
}