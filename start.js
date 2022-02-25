import { updatefiles, getportopeners, getmostprofitable, getallservers } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	let pservs = ns.getPurchasedServers();

	getallservers(ns);

	ns.run("mcp.js");
	ns.run("hudstart.js");


	// buy pservs with ram = home + home, if we don't have 25 pservs
	// start if we are winning the war
	if (ns.gang.inGang()) {
		if (ns.gang.getGangInformation().territory >= .99) {
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
		ns.run("/gangs/tasks.js");
	}


	// sleeves
	ns.run("/sleeves/sleeve-control.js");

	if (ns.getPlayer().hasCorporation === true && ns.getServerMaxRam('home') >= 2048) {
		ns.run("/hacknet/buynodes.js");
		//ns.run("/corps/control-corp.js");
	}
}