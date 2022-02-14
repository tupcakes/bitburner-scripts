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
				// let choices = getcrimerisk(ns, i);
				// let bestcrime = getbestcrime(ns, choices);
				// if (task.crime !== bestcrime[0]) {
				// 	ns.sleeve.setToCommitCrime(i, bestcrime[0]);
				// }


				if (ns.getPlayer().factions.includes('The Covenant')) {
					if (task.factionWorkType !== 'Hacking Contracts') {
						ns.sleeve.setToFactionWork(i, 'The Covenant', 'Hacking Contracts');
					}
				} else if (task.crime !== 'Mug') {
					ns.sleeve.setToCommitCrime(i, 'Mug');
				}
			}
		}
	}
}
