import { countPrograms } from "/libraries/root.js";
import { getportopeners } from "/libraries/utils.js";

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


	while (true) {
		await ns.sleep(100);

		getportopeners(ns);

		roottargetsloop:
		for (let i = 0; i < targets.length; ++i) {
			await ns.sleep(20);
			if (ns.hasRootAccess(targets[i].name) === true) {
				continue roottargetsloop;
			}
			if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(targets[i].name)) {
				if (countPrograms(ns) >= ns.getServerNumPortsRequired(targets[i].name)) {
					ns.run('/helpers/get_root.js', 1, targets[i].name)
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
				}
			}
		}
	}
}
