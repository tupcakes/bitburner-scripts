import { getcrimerisk, getbestcrime, getsleevecrimechance } from "/libraries/sleeves.js";


/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		await ns.sleep(20);

		let sleeves = ns.sleeve.getNumSleeves();

		// recover
		if (ns.gang.inGang() === true) {
			for (let i = 0; i < sleeves; i++) {
				if (ns.sleeve.getSleeveStats(sleeves[i]).sync < 100) {
					ns.sleeve.setToSynchronize(sleeves[i]);
				}
			}
		}


		// commit crimes
		for (let i = 0; i < sleeves; i++) {
			let task = ns.sleeve.getTask(0);
			if (ns.gang.inGang() === false) {
				if (getsleevecrimechance(ns, 'Homicide', i) < .9 && task.crime !== 'Mug') {
					ns.sleeve.setToCommitCrime(sleeves[i], 'Mug');
				} else if (getsleevecrimechance(ns, 'Homicide', i) >= .9 && task.crime !== 'Homicide') {
					ns.sleeve.setToCommitCrime(sleeves[i], 'Homicide');
				}
			} else {
				let choices = getcrimerisk(ns, i);
				let bestcrime = getbestcrime(ns, choices);
				if (task.crime !== bestcrime) {
					ns.sleeve.setToCommitCrime(sleeves[i], bestcrime);
				}
			}
		}
	}
}