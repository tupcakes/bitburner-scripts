/** @param {NS} ns **/
export async function main(ns) {
	ns.run("root_all.js");
	ns.run("/earlygame/attack_local.js");
	ns.run("control-home.js", 1, "n00dles");

	if (ns.getHackingLevel() >= 100) {
		ns.run("control-home.js", 1, "joesguns");
	}

	// only run max of 2 here
	if (ns.getPurchasedServers.length > 0){
		ns.run("control.js", 1, "max-hardware");
		ns.run("control.js", 1, "johnson-ortho");
	}
}