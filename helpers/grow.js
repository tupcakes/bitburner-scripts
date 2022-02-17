/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0];
	let pauseoffset = ns.args[1];

	await ns.sleep(pauseoffset);

	if (ns.args.length >= 3) {
		await ns.grow(server, { stock: ns.args[2] });
	} else {
		await ns.grow(target);
	}
}
