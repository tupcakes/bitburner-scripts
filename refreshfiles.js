// Removes user files from all hackable hosts and then copies new versions.

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let serverlist = ns.read("server_list.txt");
	let targets = serverlist.split("\r\n");
	let files = ns.ls('home', ".js");
	files.push('server_list.txt');

	for (let i = 0; i < targets.length; ++i) {
		let target = JSON.stringify(targets[i].split(",")).replace('["', '').replace('"]', '');
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