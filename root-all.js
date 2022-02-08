import { countPrograms } from "/libraries/root.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	ns.clearLog();

	const factionservers = [
		"CSEC",
		"avmnite-02h",
		"I.I.I.I",
		"run4theh111z",
	];

	let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	let pservs = ns.getPurchasedServers();
	let allservers = [];
	allservers.push("home");
	for (const pserv of pservs) {
		allservers.push(pserv);
	}
	for (const target of targets) {
		if (ns.getServerMaxRam(target.name) > 0) {
			allservers.push(target.name);
		}
	}


	while (true) {
		await ns.sleep(100);
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

							let copyfiles_pid = ns.run('/helpers/copyfiles.js', 1, targets[i].name);
							await ns.sleep(100);

							copyrunningloop:
							while (ns.isRunning(copyfiles_pid) === true) {
								await ns.sleep(20);
								continue copyrunningloop;
							}
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
	}
}