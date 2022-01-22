/**
 * Does work related items.
 * Requires: singularity
 * check if any programs to create
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
	let refreshfiles_pid = ns.run('refreshfiles.js', 1);
	while (ns.isRunning(refreshfiles_pid) === true) {
		ns.clearLog();
		ns.print("Updating files.")
		await ns.sleep(100);
		continue;
	}
	ns.print("Done updating files.");

	// cancel any running work
	ns.stopAction();


	while (true) {
		await ns.sleep(100);
		if (ns.isBusy() === true) {
			continue;
		}


		// -------Create programs-------
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


		// -------Faction Work-------
		let worktime = 900000; // used for crime also
		let workforfaction_ram = ns.getScriptRam('/helpers/workforfaction.js');
		// work for factions
		let factions = JSON.parse(JSON.stringify(ns.getPlayer().factions));
		//types
		//  Field,
		//  Hacking,
		//  None,
		//  Security,
		for (const faction of factions) {
			if (ns.gang.inGang() === false) {
				if (faction === 'Slum Snakes') {
					for (let i = 0; i < allservers.length; ++i) {
						let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
						if (availableram > workforfaction_ram) {
							ns.exec('/helpers/workforfaction.js', allservers[i], 1, faction, 'Security');
							await ns.sleep(worktime);
							ns.stopAction();
							break;
						}
					}
				}
			}
			if (faction === 'CyberSec') {
				for (let i = 0; i < allservers.length; ++i) {
					let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
					if (availableram > workforfaction_ram) {
						ns.exec('/helpers/workforfaction.js', allservers[i], 1, faction, 'Hacking');
						await ns.sleep(worktime);
						ns.stopAction();
						break;
					}
				}
			}
			if (faction === 'NiteSec') {
				for (let i = 0; i < allservers.length; ++i) {
					let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
					if (availableram > workforfaction_ram) {
						ns.exec('/helpers/workforfaction.js', allservers[i], 1, faction, 'Hacking');
						await ns.sleep(worktime);
						ns.stopAction();
						break;
					}
				}
			}
		}


		// -------do crime-------
		let bestcrime_ram = ns.getScriptRam('/singularity_scripts/bestcrime.js');
		for (let i = 0; i < allservers.length; ++i) {
			let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
			if (availableram > bestcrime_ram) {
				ns.exec('/singularity_scripts/bestcrime.js', allservers[i], 1)
				await ns.sleep(worktime);
				ns.scriptKill('/singularity_scripts/bestcrime.js', 'home');
				ns.stopAction();
				break;
			}
		}
	}
}