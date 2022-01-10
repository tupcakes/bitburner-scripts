/** @param {NS} ns **/
export async function main(ns) {
	ns.run("/buy/servers.js", 1, 1024);
	ns.run("root_all.js");
	ns.run("/earlygame/attack_local.js");
	ns.run("control-home.js", 1, "n00dles");

	if (ns.getServerMaxRam(ns.getHostname()) >= 128) {
		if (ns.getHackingLevel() >= 100) {
			ns.run("control-home.js", 1, "joesguns");
		}
	}

	if (ns.getServerMaxRam(ns.getHostname()) >= 512) {
		if (ns.getHackingLevel() >= 250) {
			ns.run("control-home.js", 1, "silver-helix");
		}
	}

	if (ns.getServerMaxRam(ns.getHostname()) >= 1024) {
		if (ns.getHackingLevel() >= 500) {
			ns.run("control-home.js", 1, "comptek");
			ns.run("control-home.js", 1, "crush-fitness");
		}
	}

	// only run max of 2 here
	if (ns.getPurchasedServers().length > 0) {
		let server = "max-hardware";
		if (ns.getServerRequiredHackingLevel(server) >= ns.getHackingLevel()) {
			ns.run("control.js", 1, server);
		}
		
		server = "johnson-ortho";
		if (ns.getServerRequiredHackingLevel(server) >= ns.getHackingLevel()) {
			ns.run("control.js", 1, server);
		}
	}
}