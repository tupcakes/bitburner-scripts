/** @param {NS} ns **/
export async function main(ns) {

	// kill work scripts
	ns.scriptKill('/gangs/tasks.js', 'home');

	let ingang = ns.gang.inGang();
	let gangmembers = ns.gang.getMemberNames();
	let ganginfo = ns.gang.getGangInformation();
	let hack = 0;
	let str = 0;
	let def = 0;
	let dex = 0;
	let agi = 0;
	let cha = 0;

	while (ingang) {
		for (let i = 0; i < gangmembers.length; ++i) {
			let ascensionresult = ns.gang.getAscensionResult(gangmembers[i]);

			// if training required
			if (typeof ascensionresult === 'undefined') {
				hack = 0;
				str = 0;
				def = 0;
				dex = 0;
				agi = 0;
				cha = 0;
			} else {
				hack = ascensionresult.hack;
				str = ascensionresult.str;
				def = ascensionresult.def;
				dex = ascensionresult.dex;
				agi = ascensionresult.agi;
				cha = ascensionresult.cha;
			}

			// train combat
			if (str < 1.1 && def < 1.1 && dex < 1.1 && agi < 1.1) {
				ns.gang.setMemberTask(gangmembers[i], 'Train Combat');
				await ns.sleep(20);
				continue;
			} else if (cha < 1.1) {
				ns.gang.setMemberTask(gangmembers[i], 'Train Charisma');
				await ns.sleep(20);
				continue;
			} else if (hack < 1.1) {
				ns.gang.setMemberTask(gangmembers[i], 'Train Hacking');
				await ns.sleep(20);
				continue;
			} else {
				ns.gang.ascendMember(gangmembers[i]);
			}


		}
		await ns.sleep(20);
	}
}