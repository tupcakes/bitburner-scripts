/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	while (true) {
		await ns.sleep(20);
		await ns.weaken(ns.getHostname());
		await ns.grow(ns.getHostname());
		await ns.weaken(ns.getHostname());
		await ns.manualHack();
	}
}