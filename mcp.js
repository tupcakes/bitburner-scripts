/*
- Requires: singularity
- create programs
- root servers
  - backdoor faction servers
- join factions
*/

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
	let file = ns.read("server_list.txt");
	let targets = file.split("\r\n");
	let pservs = ns.getPurchasedServers();
	let allservers = [];
	allservers.push("home");
	for (const pserv of pservs) {
		allservers.push(pserv);
	}
	for (const target of targets) {
		if (ns.getServerMaxRam(target) > 0) {
			allservers.push(target);
		}
	}

	// update files
	ns.run('refreshfiles.js', 1);

	ns.stopAction();
	while (true) {
		await ns.sleep(100);
		if (ns.isBusy() === true) {
			continue;
		}


		// create programs
		let createprogram_ram = ns.getScriptRam('/helpers/createprogram.js');
		// brutessh
		if (ns.fileExists(programs[0]) === false && ns.getHackingLevel() >= 50) {
			for (let i = 0; i < allservers.length; ++i) {
				let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
				if (availableram > createprogram_ram) {
					ns.exec('/helpers/createprogram.js', allservers[i], 1, programs[0])
				}
			}
		}
		// ftpcrack
		if (ns.fileExists(programs[1]) === false && ns.getHackingLevel() >= 100) {
			for (let i = 0; i < allservers.length; ++i) {
				let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
				if (availableram > createprogram_ram) {
					ns.exec('/helpers/createprogram.js', allservers[i], 1, programs[1])
				}
			}
		}
		// relaysmtp
		if (ns.fileExists(programs[2]) === false && ns.getHackingLevel() >= 250) {
			for (let i = 0; i < allservers.length; ++i) {
				let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
				if (availableram > createprogram_ram) {
					ns.exec('/helpers/createprogram.js', allservers[i], 1, programs[2])
				}
			}
		}
		// httpworm
		if (ns.fileExists(programs[3]) === false && ns.getHackingLevel() >= 500) {
			for (let i = 0; i < allservers.length; ++i) {
				let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
				if (availableram > get_root_ram) {
					ns.exec('/helpers/createprogram.js', allservers[i], 1, programs[3])
				}
			}
		}
		// sqlinject
		if (ns.fileExists(programs[4]) === false && ns.getHackingLevel() >= 750) {
			for (let i = 0; i < allservers.length; ++i) {
				let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
				if (availableram > createprogram_ram) {
					ns.exec('/helpers/createprogram.js', allservers[i], 1, programs[4])
				}
			}
		}
		await ns.sleep(100);
		if (ns.isBusy() === true) {
			continue;
		}


		// root servers
		//   backdoor faction servers
		let get_root_ram = ns.getScriptRam('/helpers/get_root.js');
		for (let i = 0; i < targets.length; ++i) {
			let target = JSON.stringify(targets[i].split(",")).replace('["', '').replace('"]', '');
			if (ns.hasRootAccess(target)) {
				await ns.sleep(20);
				continue;
			} else if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target)) {
				for (let j = 0; j < allservers.length; ++j) {
					let availableram = ns.getServerMaxRam(allservers[j]) - ns.getServerUsedRam(allservers[j]);
					if (availableram > get_root_ram) {
						ns.exec('/helpers/get_root.js', allservers[j], 1, target)
						ns.tprint("Rooted: " + target);
						await ns.sleep(100);
						// backdoor
						if (factionservers.includes(target)) {
							ns.tprint("Backdoored: " + target);
							ns.run('/helpers/backdoor.js', 1, target);
						}
					}
				}
			}

		}


		// join factions
		let joinfaction_ram = ns.getScriptRam('/helpers/joinfaction.js');
		let factioninvites = ns.checkFactionInvitations();
		if (factioninvites > 0) {
			for (const factioninvite of factioninvites) {
				for (let i = 0; i < allservers.length; ++i) {
					let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
					if (availableram > joinfaction_ram) {
						ns.exec('/helpers/joinfaction.js', allservers[i], 1, factioninvite)
					}
				}
			}
		}
	}
}