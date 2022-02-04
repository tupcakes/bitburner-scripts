/** @param {NS} ns **/
export async function main(ns) {
	let faction = ns.args[0];
	let work = ns.args[1];

	//while (ns.getFactionRep(faction) < 50000) {
	while (true) {
		ns.workForFaction(faction, work, false);
		await ns.sleep(60000);
		ns.stopAction();
	}
}