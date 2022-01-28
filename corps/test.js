import { bootstrapAg } from "/libraries/corp.js";

export function autocomplete(data, args) {
	return data.servers;
}

/** @param {NS} ns **/
export async function main(ns) {
	//bootstrapAg(ns);

	ns.tprint(ns.getPlayer().bitNodeN);
}