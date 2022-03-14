import { getcrimerisk, getbestcrime, getsleevecrimechance, buysleeveaugs } from "/libraries/sleeves.js";


/** @param {NS} ns **/
export async function main(ns) {
	mainloop:
	while (true) {
		await ns.sleep(20);

		let sleeves = ns.sleeve.getNumSleeves();

		// recover - once gang is up and running
		// or 
		if (ns.gang.inGang() === true) {
			gangloop:
			for (let i = 0; i < sleeves; i++) {
				await ns.sleep(20);
				buysleeveaugs(ns, i);

				if (ns.sleeve.getInformation(i).city !== 'Volhaven') {
					ns.sleeve.travel(i, 'Volhaven');
				}

				let task = ns.sleeve.getTask(i);
				if (ns.sleeve.getSleeveStats(i).shock > 0) {
					ns.sleeve.setToShockRecovery(i);
					continue;
				}
				
				if (ns.getPlayer().factions.includes('Daedalus')) {
					if (task.factionWorkType !== 'Field Work' && i === 0) {
						ns.sleeve.setToFactionWork(0, 'Daedalus', 'Field Work');
					}
					if (i > 0 && i < (sleeves - 2)) {
						ns.sleeve.setToUniversityCourse(i, 'ZB Institute of Technology', 'Algorithms');
					} else {
						if (i >= (sleeves - 2))
							ns.sleeve.setToCommitCrime(i, 'Mug');
					}
				} else {
					if (i < (sleeves - 2)) {
						if (task.task !== 'Class') {
							ns.sleeve.setToUniversityCourse(i, 'ZB Institute of Technology', 'Study Computer Science');
						}
					} else {
						if (task.crime !== 'Mug') {
							ns.sleeve.setToCommitCrime(i, 'Mug');
						}
					}
				}
			}
		} else { // if not in gang
			for (let i = 0; i < sleeves; i++) {
				let task = ns.sleeve.getTask(i);
				if (getsleevecrimechance(ns, 'Homicide', i) < .20 && task.crime !== 'Mug') {
					ns.sleeve.setToCommitCrime(i, 'Mug');
				} else if (getsleevecrimechance(ns, 'Homicide', i) >= .20 && task.crime !== 'Homicide') {
					ns.sleeve.setToCommitCrime(i, 'Homicide');
				}
			}
		}

		if (ns.getPlayer().factions.includes('Daedalus')) {
			return;
		}
	}
}