/** @param {NS} ns **/
export async function main(ns) {
	ns.run("/buy/servers.js");
	ns.run("root_all.js");
	ns.run("/earlygame/attack_local.js");
	ns.run("control-home.js", 1, "n00dles");

	// if home ram >= 128 - add later
	if (ns.getHackingLevel() >= 100) {
		ns.run("control-home.js", 1, "joesguns");
	}
	// if home ram >= 512 - add later
	if (ns.getHackingLevel() >= 250) {
		ns.run("control-home.js", 1, "silver-helix");
	}

	// only run max of 2 here
	if (ns.getPurchasedServers().length > 0){
		ns.run("control.js", 1, "max-hardware");
		ns.run("control.js", 1, "johnson-ortho");
	}
}