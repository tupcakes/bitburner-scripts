/**
 * control.js is setup to allow running about two instances per pserv.
 * this will run the max possible - 1 instances of control.js based
 * on the number of available pservs.
 */

/** @param {NS} ns **/
export async function main(ns) {
	let serverlist = ns.read("server_list.txt");
	let targets = serverlist.split("\r\n");

	//ns.scriptKill('/earlygame/coordinator.js', 'home');

	while (true) {
		await ns.sleep(20);

		let pservs = ns.getPurchasedServers();
		let maxtargets = (pservs.length * 2) - 1;

		for (let i = 0; i < maxtargets; ++i) {
			let target = JSON.stringify(targets[i].split(",")).replace('["', '').replace('"]', '');
			if (ns.getServerRequiredHackingLevel(target) <= ns.getHackingLevel() && ns.hasRootAccess(target) === true && ns.getServerMaxRam(target) > 0 && ns.getServerMaxMoney(target) > 0) {
				ns.run("control.js", 1, target);
			}
		}

		// if we have max pservs, just attack everything.
		if (ns.getPurchasedServers().length === ns.getPurchasedServerLimit()) {
			ns.run("home-distributed.js");
		}
	}
}