/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		await ns.sleep(20);
		let fragments = ns.stanek.activeFragments();
		
		for (const fragment of fragments) {
			ns.run('charge.js', 5, fragment.x, fragment.y);
		}
	}
}