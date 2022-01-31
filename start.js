import { updatefiles, getportopeners, getmostprofitable } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	let pservs = ns.getPurchasedServers();

	ns.run("mcp.js");
	ns.run("hudstart.js");

	// buy pservs with ram = home + home, if we don't have 25 pservs
	let pservram = 0;
	if (pservs.length === 0) {
		pservram = ns.getServerMaxRam('home') * 2;
		ns.run("/buy/servers.js", 1, pservram);
	} else if (pservs.length > 0 && pservs.length < 25) {
		pservram = ns.getServerMaxRam(pservs[0]);
		ns.run("/buy/servers.js", 1, pservram);
	} else {
		ns.run("/buy/upgradepservs.js");
	}
	
	// update files
	await updatefiles(ns);

	// get tor and port openers
	//ns.purchaseTor();
	getportopeners(ns);

	if (ns.gang.inGang() === true) {
		ns.run("/gangs/tasks.js");
	}
	
	if (pservs.length > 1 && pservs.length < 25) {
		ns.run("pserv-controller.js");
		let bestserver = getmostprofitable(ns);
		ns.run('/earlygame/coordinator.js', 1, bestserver);
	} else if (pservs.length === 25) {
		ns.run("pserv-controller.js");
		ns.run("distributed-share.js");
	} else {
		let bestserver = getmostprofitable(ns);
		ns.run('/earlygame/coordinator.js', 1, bestserver);
		ns.run("pserv-controller.js");
	}
}