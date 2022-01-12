/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail("weaken.js", "home", ns.args[0]);
	let target = ns.args[0];
	let pauseoffset = ns.args[1];

	await ns.sleep(pauseoffset);
	await ns.weaken(target);
}