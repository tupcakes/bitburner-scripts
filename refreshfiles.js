// Removes user files from all hackable hosts and then copies new versions.

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	// update owned servers
	let pservs = ns.getPurchasedServers();

	for (let j = 0; j < pservs.length; ++i) {
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
	let serverlist = ns.read("server_list.txt");
	let targets = serverlist.split("\r\n");
	let files = ns.ls('home', ".js");
	files.push('server_list.txt');

	for (let i = 0; i < targets.length; ++i) {
		let target = JSON.stringify(targets[i].split(",")).replace('["', '').replace('"]', '');
		ns.killall(target);
		if (ns.hasRootAccess(target)) {
			for (let i = 0; i < files.length; i++) {
				ns.print(target + ": " + files[i]);
				ns.rm(files[i], target);
				// get new copies
				await ns.scp(files[i], target);
				await ns.sleep(20);
			}
		}
		await ns.sleep(20);
	}
}