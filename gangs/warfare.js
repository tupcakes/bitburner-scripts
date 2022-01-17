/** @param {NS} ns **/
export async function main(ns) {
	let gangmembers = ns.gang.getMemberNames();

	ns.scriptKill('/gangs/tasks.js', 'home');
	ns.scriptKill('/gangs/training.js', 'home');

	for (let i = 0; i < gangmembers.length; ++i) {
		ns.gang.setMemberTask(gangmembers[i], 'Territory Warfare');
	}
}