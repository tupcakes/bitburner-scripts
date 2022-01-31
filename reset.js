/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();
	ns.print("Getting ready to install augments and reset.");
	for (let i = 10; i > 0; --i) {
		ns.print(i + "...");
		await ns.sleep(1000);
	}
	ns.installAugmentations('start.js');
}