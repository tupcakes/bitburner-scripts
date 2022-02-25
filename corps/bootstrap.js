import { cities } from 'constants.js'

/** @param {NS} ns **/
export async function main(ns) {
	// create corp
	// found software div
	// expand to all cities
	// buy office and warehouse APIs
	// buy 1 warehouse upgrade for each city if warehouse space is 0
	// hire employees x3
	// increase staff space x15 for each city
	// set AI cores sale to MAX/MP
	// buy DreamSense x?
	// spend rest on advert
	// run config-corp
	// run control-corp

	const division = 'Software';

	if (ns.getServerMoneyAvailable('home') < 150000000000 && ns.getPlayer().hasCorporation === false) {
		ns.tprint("Not enough money.");
		return;
	}

	// create corp
	if (ns.getPlayer().hasCorporation === false) {
		ns.corporation.createCorporation('Bit', true);
	}

	// create software division
	if (ns.corporation.getCorporation().divisions[0].name.includes(division) === false) {
		ns.corporation.expandIndustry(division, division);
	}

	// buy upgrades
	if (ns.corporation.hasUnlockUpgrade('Smart Supply') === false) {
		ns.corporation.unlockUpgrade('Smart Supply');
	}
	if (ns.corporation.hasUnlockUpgrade('Warehouse API') === false) {
		ns.corporation.unlockUpgrade('Warehouse API');
	}
	if (ns.corporation.hasUnlockUpgrade('Office API') === false) {
		ns.corporation.unlockUpgrade('Office API');
	}

	// expand to all cities - requires apis
	for (const city of cities) {
		// expand to city
		if (ns.corporation.getCorporation().divisions[0].cities.includes(city)) {
			ns.corporation.expandCity(division, city);
		}

		if (ns.corporation.hasUnlockUpgrade('Smart Supply')) {
			ns.corporation.setSmartSupply(division, city, true);
		}

		if (ns.corporation.hasUnlockUpgrade('Office API')) {
			// hire employees
			for (let i = 0; i < 3; i++) {
				ns.corporation.hireEmployee(division, city);
			}

			if (ns.corporation.hasUnlockUpgrade('Warehouse API')) {
				ns.corporation.purchaseWarehouse(division, city);
				// set AI cores sale to MAX/MP
				ns.corporation.sellMaterial(division, city, 'AI Cores', 'MAX', 'MP');
			}
		}

		// // buy dreamsense
		// for (let i = 0; i < 2; i++) {
		// 	ns.corporation.levelUpgrade('DreamSense');
		// }

		// // spend remaining money on advert
		// while (ns.corporation.getHireAdVertCost(division) <= ns.corporation.getCorporation().funds) {
		// 	ns.corporation.hireAdVert(division);
		// }

		// assign employees
		//ns.run('/corps/config-corp.js');
		//ns.run('/corps/control-corp.js');
	}
}