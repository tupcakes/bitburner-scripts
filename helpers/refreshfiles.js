// Removes user files from all hackable hosts and then copies new versions.

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let files = ns.ls('home', ".js");
	files.push('serversbyhacklvl.json.txt');

	// update owned servers
	let pservs = ns.getPurchasedServers();

	for (let j = 0; j < pservs.length; ++j) {
		if (ns.hasRootAccess(pservs[j])) {
			ns.killall(pservs[j]);
			for (let i = 0; i < files.length; i++) {
				ns.print(pservs[j] + ": " + files[i]);
				ns.rm(files[i], pservs[j]);
				// get new copies
				await ns.scp(files[i], pservs[j]);
				await ns.sleep(20);
			}
		}
		await ns.sleep(20);
	}


	// update non-owned servers
	let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	for (let i = 0; i < targets.length; ++i) {
		ns.killall(targets.name);
		if (ns.hasRootAccess(targets)) {
			for (let i = 0; i < files.length; i++) {
				ns.print(targets.name + ": " + files[i]);
				ns.rm(files[i], targets.name);
				// get new copies
				await ns.scp(files[i], targets.name);
				await ns.sleep(20);
			}
		}
		await ns.sleep(20);
	}
}