import { updatefiles, getportopeners, getmostprofitable } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	let pservs = ns.getPurchasedServers();

	ns.run("mcp.js");
	ns.run("hudstart.js");

	// ns.run("/buy/hacknet.js");
	ns.run("/hacknet/buynodes.js");


	// buy pservs with ram = home + home, if we don't have 25 pservs
	// start if we are winning the war
	if (ns.gang.getGangInformation().territory >= .99) {
		ns.run("pserv-controller.js");
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

	// // update files
	//await updatefiles(ns);

	if (ns.gang.inGang() === true) {
		ns.run("/gangs/tasks.js");
	}


	// sleeves
	ns.run("/sleeves/sleeve-control.js");


	await ns.sleep(5000);
	ns.run('/earlygame/coordinator.js', 1, 'n00dles');
	ns.run('/earlygame/coordinator.js', 1, 'foodnstuff');
	//ns.run("distributed-share.js");
	


	if (ns.getPlayer().hasCorporation === true && ns.getServerMaxRam('home') >= 2048) {
		ns.run("/corps/control-corp.js");
	}
}