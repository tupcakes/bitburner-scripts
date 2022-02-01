/*
- Requires: singularity
- root servers
  - backdoor faction servers
- join factions
*/

import { countPrograms } from "/libraries/root.js";
import { buyaugments, createexes, findavailableserver } from "/libraries/utils.js";


/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

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


	ns.stopAction();
	while (true) {
		await ns.sleep(100);

		// buy ram for home if possible
		ns.upgradeHomeRam();

		// buy approved augments
		buyaugments(ns);

		// hacking contracts
		if (ns.isBusy() === false) {
			if (ns.getPlayer().bitNodeN === 2) {
				ns.run('/helpers/workforfaction.js', 1, 'Sector-12', 'Hacking');
			} else {
				ns.run('/helpers/workforfaction.js', 1, 'Daedalus', 'Hacking');
			}
		}

		// create programs - for int
		//await createexes(ns);

		// check if ready to install augments and reset
		let pendingaugs = ns.getOwnedAugmentations(true).length - ns.getOwnedAugmentations(false).length;
		if (pendingaugs >= 4) {
			ns.run("reset.js");
		}

		// root servers
		//   backdoor faction servers
		let get_root_ram = ns.getScriptRam('/helpers/get_root.js');

		roottargetsloop:
		for (let i = 0; i < targets.length; ++i) {
			let target = JSON.stringify(targets[i].split(",")).replace('["', '').replace('"]', '');
			if (ns.hasRootAccess(target) === true) {
				await ns.sleep(20);
				continue roottargetsloop;
			}
			if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target)) {
				rootallserversloop:
				for (let j = 0; j < allservers.length; ++j) {
					if (countPrograms(ns) >= ns.getServerNumPortsRequired(target)) {
						let availableram = ns.getServerMaxRam(allservers[j]) - ns.getServerUsedRam(allservers[j]);
						if (availableram > get_root_ram) {
							ns.exec('/helpers/get_root.js', allservers[j], 1, target)
							ns.tprint("Rooted: " + target);
							ns.print("Rooted: " + target);

							let copyfiles_pid = ns.run('/helpers/copyfiles.js', 1, target);
							await ns.sleep(100);

							copyrunningloop:
							while (ns.isRunning(copyfiles_pid) === true) {
								await ns.sleep(20);
								continue copyrunningloop;
							}
							// backdoor
							if (factionservers.includes(target)) {
								ns.run('/helpers/backdoor.js', 1, target);
								ns.tprint("Backdoored: " + target);
								ns.print("Backdoored: " + target);
								await ns.sleep(5000);
							}
							break rootallserversloop;
						}
					}
				}
			}
		}

		// join factions
		let joinfaction_ram = ns.getScriptRam('/helpers/joinfaction.js');
		let factioninvites = ns.checkFactionInvitations();
		if (factioninvites.length > 0) {
			for (const factioninvite of factioninvites) {

				factionaserversloop:
				for (let i = 0; i < allservers.length; ++i) {
					let availableram = ns.getServerMaxRam(allservers[i]) - ns.getServerUsedRam(allservers[i]);
					if (availableram > joinfaction_ram) {
						ns.exec('/helpers/joinfaction.js', allservers[i], 1, factioninvite);
						ns.print('Joined: ' + factioninvite);
						break factionaserversloop;
					}
				}
			}
		}
	}
}