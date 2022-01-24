import { countPrograms, breakPorts } from "/libraries/root.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	let target = ns.args[0];

	if (countPrograms(ns) >= ns.getServerNumPortsRequired(target)) {
		breakPorts(ns, target);
		ns.nuke(target);
	}
}