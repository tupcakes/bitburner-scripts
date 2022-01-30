import { updatefiles, getportopeners, getmostprofitable } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.run("mcp.js");

	// update files
	await updatefiles(ns);

	//ns.run("/buy/hacknet.js");

	// get tor and port openers - disabling because of int gain when self creating
	ns.purchaseTor();
	//getportopeners(ns);

	let pservs = ns.getPurchasedServers();

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