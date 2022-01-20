/** @param {NS} ns **/
export async function main(ns) {
	let factioninvite = ns.args[0];
	ns.joinFaction(factioninvite);
}