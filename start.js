/** @param {NS} ns **/
export async function main(ns) {
	let pserv = ns.getPurchasedServers();

	//ns.run("/buy/servers.js", 1, 1024);
	ns.run("root_all.js");
	//ns.run("/earlygame/attack_local.js");

	//await ns.sleep(1000);
	//ns.run("control-home.js", 1, "n00dles");

	if (pserv.length == 0) {
		ns.run("control-home.js", 1, "foodnstuff");

		if (ns.getServerMaxRam(ns.getHostname()) >= 1024) {
			if (ns.getHackingLevel() >= 100) {
				ns.run("control-home.js", 1, "joesguns");
				ns.run("control-home.js", 1, "max-hardware");
				ns.run("control-home.js", 1, "sigma-cosmetics");
				ns.run("control-home.js", 1, "hong-fang-tea");
				ns.run("control-home.js", 1, "harakiri-sushi");
				ns.run("control-home.js", 1, "iron-gym");
			}
		}
	}

	if (pserv.length > 0) {
		ns.run("home-distributed.js");
	}


}