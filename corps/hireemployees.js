import { cities } from 'constants.js'


/** @param {NS} ns **/
export async function main(ns) {
	const division = 'Software';


	for (const city of cities) {
		await ns.sleep(20);
		let oneemployeecost = ns.corporation.getOfficeSizeUpgradeCost(division, city, 1);
		let newemployeecount = Math.floor(ns.corporation.getCorporation().funds / oneemployeecost);

		if (newemployeecount === 0) {
			return;
		}

		ns.corporation.upgradeOfficeSize(division, city, newemployeecount);
		for (let i = 0; i < newemployeecount; i++) {
			await ns.sleep(20);
			ns.corporation.hireEmployee(division, city);
		}
	}
}