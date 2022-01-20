/** @param {NS} ns **/
export async function main(ns) {
	let faction = ns.args[0];
	let work = ns.args[1];
	ns.workForFaction(faction, work, true);
}