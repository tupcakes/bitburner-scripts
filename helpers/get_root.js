import { countPrograms, breakPorts } from "/libraries/root.js";
import { copyfiles } from "/libraries/utils.js";

export function autocomplete(data, args) {
	return data.servers;
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	let target = ns.args[0];

	if (countPrograms(ns) >= ns.getServerNumPortsRequired(target)) {
		breakPorts(ns, target);
		ns.nuke(target);
		await copyfiles(ns, target);
	}
}