/** @param {NS} ns **/
export async function main(ns) {
	ns.run("/buy/servers.js", 1, 1024);
	ns.run("root_all.js");
	ns.run("/earlygame/attack_local.js");

	await ns.sleep(1000);
	ns.run("control-home.js", 1, "n00dles");

	if (ns.getServerMaxRam(ns.getHostname()) >= 128) {
		if (ns.getHackingLevel() >= 100) {
			ns.run("control-home.js", 1, "joesguns");
		}
	}

	if (ns.getServerMaxRam(ns.getHostname()) >= 1024) {
		if (ns.getHackingLevel() >= 250) {
			ns.run("control-home.js", 1, "silver-helix");
			ns.run("control-home.js", 1, "max-hardware");
		}
	}

	if (ns.getServerMaxRam(ns.getHostname()) >= 8192) {
		if (ns.getHackingLevel() >= 500) {
			ns.run("control-home.js", 1, "comptek");
			ns.run("control-home.js", 1, "crush-fitness");
		}
	}
	if (ns.getServerMaxRam(ns.getHostname()) >= 16384) {
		if (ns.getHackingLevel() >= 1000) {
			ns.run("control-home.js", 1, "syscore");
			ns.run("control-home.js", 1, "snap-fitness");
		}
	}

	// only run max of 2 here
	if (ns.getPurchasedServers().length > 0) {
		let server = "crush-fitness";
		if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
			ns.run("control.js", 1, server);
		}
		
		server = "johnson-ortho";
		if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
			ns.run("control.js", 1, server);
		}
	}
}