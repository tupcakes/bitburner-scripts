/** @param {NS} ns **/
export async function main(ns) {
	let pserv = ns.getPurchasedServers();

	ns.run("root_all.js");
	ns.run("prep_local.js");

	//await ns.sleep(1000);
	ns.run("control.js", 1, "n00dles");

	if (pserv.length > 0) {
		ns.run("control.js", 1, "foodnstuff");

		if (ns.getHackingLevel() >= 100) {
			ns.run("control.js", 1, "joesguns");
			ns.run("control.js", 1, "max-hardware");
			ns.run("control.js", 1, "sigma-cosmetics");
			ns.run("control.js", 1, "hong-fang-tea");
			ns.run("control.js", 1, "harakiri-sushi");
			ns.run("control.js", 1, "iron-gym");
		}
		if (ns.getHackingLevel() >= 200) {
			ns.run("control.js", 1, "zer0");
			ns.run("control.js", 1, "max-hardware");
			ns.run("control.js", 1, "silver-helix");
		}
	}
}