import { updatefiles } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	// update files
	await updatefiles(ns);

	let pservs = ns.getPurchasedServers();

	ns.run("mcp.js");
	if (ns.gang.inGang() === true) {
		ns.run("/gangs/tasks.js");
	}
	ns.run("distributed-share.js");
	// ns.run("upgradepservs.js");

	if (pservs.length > 0 && pservs.length < 25) {
		ns.run("pserv-controller.js");
	} else if (pservs.length === 25) {
		ns.scriptKill('pserv-controller.js', 'home');
		ns.run("home-distributed.js");
	}

	if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel('megacorp')) {
		ns.run('control.js', 1, 'megacorp');
	}
}