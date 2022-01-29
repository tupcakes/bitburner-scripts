import { updatefiles, getportopeners, getmostprofitable } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	// update files
	await updatefiles(ns);

	ns.run("/buy/hacknet.js");

	// get tor and port openers - disabling because of int gain when self creating
	//getportopeners(ns);

	let pservs = ns.getPurchasedServers();

	ns.run("mcp.js");
	if (ns.gang.inGang() === true) {
		ns.run("/gangs/tasks.js");
		//ns.run("distributed-share.js");
	}
	
	if (pservs.length > 0 && pservs.length < 25) {
		ns.run("pserv-controller.js");
		let bestserver = getmostprofitable(ns);
		ns.run('/earlygame/coordinator.js', 1, bestserver);
	} else if (pservs.length === 25) {
		ns.scriptKill('pserv-controller.js', 'home');
		ns.run("home-distributed.js");
	} else {
		let bestserver = getmostprofitable(ns);
		ns.run('/earlygame/coordinator.js', 1, bestserver);
	}

	// if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel('megacorp')) {
	// 	ns.run('control.js', 1, 'megacorp');
	// }
}