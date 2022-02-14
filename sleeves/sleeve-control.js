import { getcrimerisk, getbestcrime, getsleevecrimechance } from "/libraries/sleeves.js";


/** @param {NS} ns **/
export async function main(ns) {
	mainloop:
	while (true) {
		await ns.sleep(200);

		let sleeves = ns.sleeve.getNumSleeves();

		// recover - once gang is up and running
		if (ns.gang.inGang() === true) {
			for (let i = 0; i < sleeves; i++) {
				while (ns.sleeve.getSleeveStats(i).shock > 0 && ns.isBusy() === false) {
					ns.sleeve.setToShockRecovery(i);
				}
			}
		}


		// commit crimes - will prioritize getting gang started
		for (let i = 0; i < sleeves; i++) {
			let task = ns.sleeve.getTask(i);
			if (ns.gang.inGang() === false) {
				if (getsleevecrimechance(ns, 'Homicide', i) < .9 && task.crime !== 'Mug') {
					ns.sleeve.setToCommitCrime(i, 'Mug');
				} else if (getsleevecrimechance(ns, 'Homicide', i) >= .9 && task.crime !== 'Homicide') {
					ns.sleeve.setToCommitCrime(i, 'Homicide');
				}
			} else {
				if (ns.sleeve.getSleeveStats(i).shock > 0) {
					continue mainloop;
				}

				// if we are member of daedalus, work for them and assign rest to mugging for xp
				// if not a member just have everyone do mugging 
				if (ns.getPlayer().factions.includes('Daedalus')) {
					if (task.factionWorkType !== 'Field Work' && i === 0) {
						ns.sleeve.setToFactionWork(0, 'Daedalus', 'Field Work');
					} else {
						if (task.crime !== 'Mug') {
							ns.sleeve.setToCommitCrime(i, 'Mug');
						}
					}
				} else if (task.crime !== 'Mug') {
					ns.sleeve.setToCommitCrime(i, 'Mug');
				}

				for (const aug of ns.sleeve.getSleevePurchasableAugs(i)) {
					ns.sleeve.purchaseSleeveAug(i, aug.name);
				}
			}
		}
	}
}