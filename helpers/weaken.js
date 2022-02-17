/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0];
	let pauseoffset = ns.args[1];

	await ns.sleep(pauseoffset);
	await ns.weaken(target);
}