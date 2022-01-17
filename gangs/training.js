/** @param {NS} ns **/
export async function main(ns) {

	// kill work scripts
	ns.scriptKill('/gangs/tasks.js', 'home');

	let ingang = ns.gang.inGang();
	let gangmembers = ns.gang.getMemberNames();

	while (ingang) {
		for (let i = 0; i < gangmembers.length; ++i) {
			let ascensionresult = ns.gang.getAscensionResult(gangmembers[i]);

			// if training required
			if (typeof ascensionresult === 'undefined') {
				ascensionresult.hack = 0;
				ascensionresult.str = 0;
				ascensionresult.def = 0;
				ascensionresult.dex = 0;
				ascensionresult.agi = 0;
				ascensionresult.cha = 0;
			}

			// train combat
			if (ascensionresult.str < 1.1 && ascensionresult.def < 1.1 && ascensionresult.dex < 1.1 && ascensionresult.agi < 1.1) {
				ns.gang.setMemberTask(gangmembers[i], 'Train Combat');
				await ns.sleep(20);
				continue;
			}
			if (ascensionresult.cha < 1.1) {
				ns.gang.setMemberTask(gangmembers[i], 'Train Charisma');
				await ns.sleep(20);
				continue;
			}
			if (ascensionresult.hack < 1.1) {
				ns.gang.setMemberTask(gangmembers[i], 'Train Hacking');
				await ns.sleep(20);
				continue;
			}
		}
		await ns.sleep(20);
	}
}