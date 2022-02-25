import { cities } from 'constants.js'


/** @param {NS} ns **/
export async function main(ns) {
	const division = 'Software';


	for (const city of cities) {
		await ns.sleep(20);
		let oneemployeecost = ns.corporation.getOfficeSizeUpgradeCost(division, city, 1);
		let newemployeecount = Math.floor(ns.corporation.getCorporation().funds / oneemployeecost);

		if (ns.corporation.getOffice(division, city).size > newemployeecount) {
			continue;
		}

		ns.corporation.upgradeOfficeSize(division, city, newemployeecount);
		for (let i = 0; i < newemployeecount; i++) {
			ns.corporation.hireEmployee(division, city);
		}
	}
}