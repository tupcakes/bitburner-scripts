import { getcrimerisk, getbestcrime, getsleevecrimechance } from "/libraries/sleeves.js";


/** @param {NS} ns **/
export async function main(ns) {
	mainloop:
	while (true) {
		await ns.sleep(20);

		let sleeves = ns.sleeve.getNumSleeves();

		// recover - once gang is up and running
		if (ns.gang.inGang() === true) {
			for (let i = 0; i < sleeves; i++) {
				while (ns.sleeve.getSleeveStats(sleeves[i]).shock > 0 && ns.isBusy() === false) {
					ns.sleeve.setToShockRecovery(sleeves[i]);
				}
			}
			for (let i = 0; i < sleeves; i++) {
				if (ns.sleeve.getSleeveStats(sleeves[i]).sync < 100 && ns.isBusy() === false) {
					ns.sleeve.setToSynchronize(sleeves[i]);
				}
			}
		}


		// commit crimes - will prioritize getting gang started
		for (let i = 0; i < sleeves; i++) {
			let task = ns.sleeve.getTask(0);
			if (ns.gang.inGang() === false) {
				if (getsleevecrimechance(ns, 'Homicide', i) < .9 && task.crime !== 'Mug') {
					ns.sleeve.setToCommitCrime(sleeves[i], 'Mug');
				} else if (getsleevecrimechance(ns, 'Homicide', i) >= .9 && task.crime !== 'Homicide') {
					ns.sleeve.setToCommitCrime(sleeves[i], 'Homicide');
				}
			} else {
				if (ns.sleeve.getSleeveStats(sleeves[i]).shock > 0) {
					continue mainloop;
				} else {
					let choices = getcrimerisk(ns, i);
					let bestcrime = getbestcrime(ns, choices);
					// if (task.crime !== bestcrime[0]) {
					// 	ns.sleeve.setToCommitCrime(i, bestcrime[0]);
					// }
					if (task.crime !== 'Mug') {
						ns.sleeve.setToCommitCrime(i, 'Mug');
					}
				}
			}
		}
	}
}