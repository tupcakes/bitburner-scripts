/*
- Requires: singularity
- root servers
  - backdoor faction servers
- join factions
*/

import { countPrograms } from "/libraries/root.js";
import { buyaugments, getportopeners, createexes, findavailableserver } from "/libraries/utils.js";

export function getserverswithram(ns) {
	ns.run('createserverlist.js');
	let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	// let pservs = ns.getPurchasedServers();
	let allservers = [];
	allservers.push("home");
	// for (const pserv of pservs) {
	// 	allservers.push(pserv);
	// }
	// only use servers with ram
	for (const target of targets) {
		if (target.maxram > 0) {
			allservers.push(target.name);
		}
	}
	return allservers;
}

export function getallservers(ns) {
	ns.run('createserverlist.js');
	let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	return targets;
}


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


	ns.stopAction();
	mainloop:
	while (true) {
		await ns.sleep(100);


		let allservers = getserverswithram(ns);
		let targets = getallservers(ns);

		// scan for contracts
		ns.run('contracts/contract-scanner.js');


		// check if ready to install augments and reset
		let pendingaugs = ns.getOwnedAugmentations(true).length - ns.getOwnedAugmentations(false).length;
		if (pendingaugs >= 4 && ns.gang.inGang() && ns.gang.getGangInformation().territory > .99) {
			let symbols = ns.stock.getSymbols();
			for (const sym of symbols) {
				if (ns.stock.getPosition(sym)[0] > 0 || ns.stock.getPosition(sym)[2] > 0) {
					ns.run("/stocks/selloff.js");
					continue mainloop;
				}
				ns.run("reset.js");
			}
		}


		// if we won the war start trading stocks
		if (ns.gang.getGangInformation().territory > .99 && ns.getPlayer().hasTixApiAccess && ns.getPlayer().has4SDataTixApi === false) {
			ns.run('/stocks/early-stock-trader.js');
			ns.tail('/stocks/early-stock-trader.js');
		}
		if (ns.gang.getGangInformation().territory > .99 && ns.getPlayer().hasTixApiAccess && ns.getPlayer().has4SDataTixApi === true) {
			ns.run('/stocks/stock-trader.js');
			ns.tail('/stocks/stock-trader.js');
		}


		// buy stock api
		if (ns.getPlayer().hasWseAccount && ns.getPlayer().hasTixApiAccess) {
			ns.stock.purchase4SMarketData();
			ns.stock.purchase4SMarketDataTixApi();
		}

		// if cache is getting full buy something
		if (ns.getPlayer().hasCorporation) {
			ns.hacknet.spendHashes('Sell for Corporation Funds');
		} else {
			ns.hacknet.spendHashes('Sell for Money');
		}

		getportopeners(ns);

		// make sure critical scripts are running if they should be
		if (ns.gang.inGang() === true) {
			if (ns.scriptRunning('/gangs/tasks.js', 'home') === false) {
				ns.print("Gang control wasn't running. Starting...");
				ns.run('/gangs/tasks.js');
			}
		}
		if (ns.scriptRunning('hudstart.js', 'home') === false) {
			ns.run('hudstart.js');
		}

		let playerfactions = ns.getPlayer().factions;

		// buy ram for home if possible
		ns.upgradeHomeRam();

		// buy approved augments
		buyaugments(ns);

		// hacking contracts

		if (ns.isBusy() === false) {
			if (playerfactions.includes('Daedalus') && ns.getPlayer().bitNodeN !== 2) {
				ns.run('/helpers/workforfaction.js', 1, 'Daedalus', 'Hacking');
			}
			if (playerfactions.includes('Sector-12') && ns.getPlayer().bitNodeN === 2) {
				ns.run('/helpers/workforfaction.js', 1, 'Sector-12', 'Hacking');
			}
		}


		// create programs - for int
		//await createexes(ns);


		// root servers
		//   backdoor faction servers
		let get_root_ram = ns.getScriptRam('/helpers/get_root.js');

		roottargetsloop:
		for (let i = 0; i < targets.length; ++i) {
			if (ns.hasRootAccess(targets[i].name) === true) {
				await ns.sleep(20);
				continue roottargetsloop;
			}
			if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(targets[i].name)) {
				rootallserversloop:
				for (let j = 0; j < allservers.length; ++j) {
					if (countPrograms(ns) >= ns.getServerNumPortsRequired(targets[i].name)) {
						let availableram = ns.getServerMaxRam(allservers[j]) - ns.getServerUsedRam(allservers[j]);
						if (availableram > get_root_ram) {
							ns.exec('/helpers/get_root.js', allservers[j], 1, targets[i].name)
							ns.tprint("Rooted: " + targets[i].name);
							ns.print("Rooted: " + targets[i].name);

							await ns.sleep(100);

							// backdoor
							if (factionservers.includes(targets[i].name)) {
								ns.run('/helpers/backdoor.js', 1, targets[i].name);
								ns.tprint("Backdoored: " + targets[i].name);
								ns.print("Backdoored: " + targets[i].name);
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