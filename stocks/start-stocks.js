import { createexes } from "/libraries/utils.js"
import { countPrograms } from "/libraries/root.js"
import { factionservers, hackingfactions } from 'constants.js'

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	ns.clearLog();

	// start the hud
	ns.run('hudstart.js');


	// if sleeve isn't in volhaven and we have enough money, travel and study.
	// if we're already in volhaven, study
	// if we don't have enough money, assume we're still in sector-12 and go study there
	let sleevenum = ns.sleeve.getNumSleeves();
	for (let i = 0; i < sleevenum; i++) {
		if (ns.sleeve.getInformation(i).city !== 'Volhaven' && ns.getServerMoneyAvailable('home') > 10000000) {
			ns.sleeve.travel(i, 'Volhaven');
		} else if (ns.sleeve.getInformation(i).city === 'Volhaven') {
			ns.sleeve.setToUniversityCourse(i, 'ZB Institute of Technology', 'Study Computer Science');
		} else if (ns.sleeve.getInformation(i).city === 'Sector-12') {
			ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Study Computer Science');
		}
	}

	// start trading stocks
	if (ns.getPlayer().has4SDataTixApi === false) {
		// do some other things to get hack up
		ns.universityCourse('Rothman University', 'Study Computer Science', false);
		ns.run('coordinator.js', 1, 'n00dles');
		ns.run('/stocks/early-stock-trader.js');
		// ns.tail('/stocks/early-stock-trader.js');
	} else {
		ns.run('/stocks/stock-trader.js');
		// ns.tail('/stocks/stock-trader.js');
	}
	ns.run('/stocks/manipulate.js');

	// we're cheap skate stock traders, so we'll make our exes. then we get root
	while (true) {
		await ns.sleep(100);
		// scan for contracts
		ns.run('contracts/contract-scanner.js');

		createexes(ns);

		ns.run('createserverlist.js');
		let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

		// root and backdoor servers
		roottargetsloop:
		for (let i = 0; i < targets.length; ++i) {
			await ns.sleep(20);
			if (ns.hasRootAccess(targets[i].name) === true) {
				continue roottargetsloop;
			}
			if (ns.getHackingLevel() >= targets[i].hackinglevel) {
				if (countPrograms(ns) >= targets[i].portsrequired) {
					ns.run('/helpers/get_root.js', 1, targets[i].name)
					ns.tprint("Rooted: " + targets[i].name);
					ns.print("Rooted: " + targets[i].name);

					// backdoor
					if (factionservers.includes(targets[i].name)) {
						ns.run('/helpers/backdoor.js', 1, targets[i].name);
						ns.tprint("Backdoored: " + targets[i].name);
						ns.print("Backdoored: " + targets[i].name);
						await ns.sleep(5000);
					}
				}
			}
		}

		// join factions
		let joinfaction_ram = ns.getScriptRam('/helpers/joinfaction.js');
		let factioninvites = ns.checkFactionInvitations();
		if (factioninvites.length > 0) {
			for (const factioninvite of factioninvites) {

				if (hackingfactions.includes(factioninvite)) {

					factionaserversloop:
					for (let i = 0; i < targets.length; ++i) {
						let availableram = ns.getServerMaxRam(targets[i].name) - ns.getServerUsedRam(targets[i].name);
						if (availableram > joinfaction_ram) {
							ns.exec('/helpers/joinfaction.js', targets[i].name, 1, factioninvite);
							ns.print('Joined: ' + factioninvite);
							break factionaserversloop;
						}
					}
				}
			}
		}
	}
}