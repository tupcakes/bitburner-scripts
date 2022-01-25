import { newgangmember, buygangequipment, ascendgangmember } from "/libraries/gang.js";

/** @param {NS} ns **/
export async function main(ns) {
	let gangmembers = ns.gang.getMemberNames();

	const gangs = [
		"Slum Snakes",
		"Speakers for the Dead",
		"The Black Hand",
		"The Dark Army",
		"The Syndicate",
		"NiteSec",
		"Tetrads",
	];

	ns.scriptKill('/gangs/tasks.js', 'home');
	ns.scriptKill('/gangs/training.js', 'home');

	ns.tprint("Wanted level is too high. Lowering.")
	// set everyone to Vigilante Justice if wanted level is too high
	while (ns.gang.getGangInformation().wantedLevel > 1) {
		for (let i = 0; i < gangmembers.length; ++i) {
			ns.gang.setMemberTask(gangmembers[i], 'Vigilante Justice');
		}
		await ns.sleep(20);
	}

	ns.tprint("Wanted level is good. Setting tasks to Territory Warfare.")
	for (let i = 0; i < gangmembers.length; ++i) {
		ns.gang.setMemberTask(gangmembers[i], 'Territory Warfare');
	}


	// determine if power is enough to win clashes
	while (true) {
		await ns.sleep(20);


		// check if we can recruit a member
		newgangmember(ns);


		// Buy equipment
		buygangequipment(ns);


		// Ascension
		ascendgangmember(ns);


		// get chance to win as array of objects
		let chances = [];
		let lowestchance = Math.min(chances);
		for (const gang of gangs) {
			let ChanceToWinClash = ns.gang.getChanceToWinClash(gang);
			// skip my gang
			if (gang === ns.gang.getGangInformation().faction) {
				continue;
			}
			chances.push(ChanceToWinClash);
		}

		lowestchance = Math.min(...chances);
		// ready for war
		if (lowestchance >= .60) {
			ns.gang.setTerritoryWarfare(true);
		}

		let territory = ns.gang.getGangInformation().territory;
		// we won
		if (territory === 1) {
			ns.gang.setTerritoryWarfare(false);
			// keep doing warfare until chance to clash is 0
			while (ns.gang.getGangInformation().territoryClashChance > 0) {
				continue;
			}
			ns.spawn('/gangs/tasks.js', 1);
		}

		// war is not going well. regroup
		if (territory < .14) {
			ns.gang.setTerritoryWarfare(false);
			ns.spawn('/gangs/tasks.js', 1);
		}
	}
}