import { updatefiles, getportopeners, getmostprofitable } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	let pservs = ns.getPurchasedServers();

	ns.run("mcp.js");
	ns.run("hudstart.js");

	ns.run("/hacknet/buynodes.js");


	// buy pservs with ram = home + home, if we don't have 25 pservs
	// start if we are winning the war
	if (ns.gang.getGangInformation().territory >= .99) {
		// if (ns.getPurchasedServerLimit() > 0) {
		// 	ns.run("hackbestxp.js");
		// }
		let pservram = 0;
		if (pservs.length === 0) {
			pservram = ns.getServerMaxRam('home');
			ns.run("/buy/servers.js", 1, pservram);
		} else if (pservs.length > 0 && pservs.length < 25) {
			pservram = ns.getServerMaxRam(pservs[0]);
			ns.run("/buy/servers.js", 1, pservram);
		} else {
			//ns.run("/buy/upgradepservs.js");
		}
	}

	if (ns.gang.inGang() === true) {
		ns.run("/gangs/tasks.js");
	}


	// sleeves
	ns.run("/sleeves/sleeve-control.js");

	if (ns.getPlayer().hasCorporation === true && ns.getServerMaxRam('home') >= 2048) {
		//ns.run("/corps/control-corp.js");
	}
}