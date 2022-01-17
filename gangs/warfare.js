/** @param {NS} ns **/
export async function main(ns) {
	let gangmembers = ns.gang.getMemberNames();

	ns.scriptKill('/gangs/tasks.js', 'home');
	ns.scriptKill('/gangs/training.js', 'home');

	ns.tprint("Wanted level is too high. Lowering.")
	// set everyone to Vigilante Justice if wanted level is too high
	while (ns.gang.getGangInformation().wantedLevel > 1) {
		for (let i = 0; i < gangmembers.length; ++i) {
			ns.gang.setMemberTask(gangmembers[i], 'Vigilante Justice');
		}
		//ns.gang.setMemberTask(gangmembers[0], 'Territory Warfare');
		await ns.sleep(20);
	}

	ns.tprint("Wanted level is good. Setting tasks to Territory Warfare.")
	for (let i = 0; i < gangmembers.length; ++i) {
		ns.gang.setMemberTask(gangmembers[i], 'Territory Warfare');
	}
}