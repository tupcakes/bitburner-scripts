import { buyaugments } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();
	ns.print("Getting ready to install augments and reset.");

	ns.scriptKill("/gangs/tasks.js", 'home');
	ns.scriptKill("/sleeves/sleeve-control.js", 'home');
	ns.scriptKill("/hacknet/buynodes.js", 'home');

	ns.run("/stocks/selloff.js");
	await ns.sleep(1000);

	buyaugments(ns);

	ns.upgradeHomeRam();

	for (let i = 10; i > 0; --i) {
		ns.print(i + "...");
		await ns.sleep(1000);
	}
	ns.installAugmentations('start.js');
}