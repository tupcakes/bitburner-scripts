/**
 * control.js is setup to allow running about two instances per pserv.
 * this will run the max possible - 1 instances of control.js based
 * on the number of available pservs.
 */

/** @param {NS} ns **/
export async function main(ns) {
	let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));


	while (true) {
		await ns.sleep(20);

		let pservs = ns.getPurchasedServers();
		let maxtargets = (pservs.length * 2) - 1;

		for (let i = 0; i < maxtargets; ++i) {
			if (ns.getServerRequiredHackingLevel(targets[i].name) <= ns.getHackingLevel() && ns.hasRootAccess(targets[i].name) === true && ns.getServerMaxRam(targets[i].name) > 0 && ns.getServerMaxMoney(targets[i].name) > 0) {
				ns.run("control.js", 1, targets[i].name);
			}
		}

		// if we have max pservs, just attack everything.
		if (ns.getPurchasedServers().length === ns.getPurchasedServerLimit()) {
			ns.run("home-distributed.js");
		}
	}
}