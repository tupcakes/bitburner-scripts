/**
 * main loop
 * check if any programs to create
 * check if can backdoor any of the faction servers (CSEC, avmnite-02h, I.I.I.I, run4theh111z)
 * check if any factions to join
 * if member of faction in faction server list
 *   work for faction for 15 min
 * do best crime for 15 minutes
 **/

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();

	const programs = [
		"BruteSSH.exe",
		"FTPCrack.exe",
		"relaySMTP.exe",
		"HTTPWorm.exe",
		"SQLInject.exe",
		// "ServerProfiler.exe",
		// "DeepscanV1.exe",
		// "DeepscanV2.exe",
		// "AutoLink.exe"
		// "Formulas.exe",
	];

	const factionservers = [
		"CSEC",
		"avmnite-02h",
		"I.I.I.I",
		"run4theh111z",
	];


	// cancel any running work
	ns.stopAction();

	while (true) {
		await ns.sleep(250);


		// Create programs
		// brutessh
		if (ns.fileExists(programs[0]) === false && ns.getHackingLevel() >= 50) {
			ns.run('/singularity_scripts/createprogram.js', 1, programs[0]);
		}
		// ftpcrack
		if (ns.fileExists(programs[1]) === false && ns.getHackingLevel() >= 100) {
			ns.run('/singularity_scripts/createprogram.js', 1, programs[1]);
		}
		// relaysmtp
		if (ns.fileExists(programs[2]) === false && ns.getHackingLevel() >= 250) {
			ns.run('/singularity_scripts/createprogram.js', 1, programs[2]);
		}
		// httpworm
		if (ns.fileExists(programs[3]) === false && ns.getHackingLevel() >= 500) {
			ns.run('/singularity_scripts/createprogram.js', 1, programs[3]);
		}
		// sqlinject
		if (ns.fileExists(programs[4]) === false && ns.getHackingLevel() >= 750) {
			ns.run('/singularity_scripts/createprogram.js', 1, programs[4]);
		}
		if (ns.isBusy() === true) {
			continue;
		}


		// backdoor servers - need to figure out tree searches
		// for (let i = 0; i < factionservers.length; ++i) {
		// 	if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel() && ns.getServer(server).backdoorInstalled === false) {
		// 		ns.run('/singularity_scripts/backdoor.js', 1, factionservers[i]);
		// 	}
		// }


		// join factions
		let factioninvites = ns.checkFactionInvitations();
		for (const factioninvite of factioninvites) {
			ns.joinFaction(factioninvite);
		}


		// work for factions
		// let timetowork = 900000;
		let timetowork = 5000;
		let factions = JSON.parse(JSON.stringify(ns.getPlayer().factions));
		//types
		//  Field,
		//  Hacking,
		//  None,
		//  Security,
		for (const faction of factions) {
			ns.tprint(faction);
			// if hacking faction
			if (faction === 'Slum Snakes') {
				ns.workForFaction(faction, "Security", true);
			}
			if (faction === 'CyberSec') {
				ns.workForFaction(faction, "Hacking", true);
			}
			await ns.sleep(timetowork);
			ns.stopAction();
		}
	}
}