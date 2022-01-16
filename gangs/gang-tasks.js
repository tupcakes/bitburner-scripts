/** 
 * super basic script that runs a task for each person. it will assign
 * Vigilante Justice if wanted level gets too high.
**/

/** @param {NS} ns **/
export async function main(ns) {

	// kill training
	ns.scriptKill('/gangs/gang-training.js', 'home');

	let wantedlevelmax = 25;

	let ingang = ns.gang.inGang();
	let ganginfo = ns.gang.getGangInformation();
	let gangmembers = ns.gang.getMemberNames();

	// if we are in a gang? loop
	while (ingang) {
		// check if we can recruit a member
		if (ns.gang.canRecruitMember()) {
			// check if name already exists
			gangmembers = ns.gang.getMemberNames();
			for (let i = 0; i > gangmembers.length; ++i) {
				if (gangmembers.includes('Thug-' + i)) {
					continue;
				} else {
					let newname = 'Thug-' + i;
					break;
				}
			}
		}


		// if wanted level gets too high assign eveyone to vigilante justice
		gangmembers = ns.gang.getMemberNames();
		let tasknames = ns.gang.getTaskNames()
		// ["Unassigned","Mug People","Deal Drugs","Strongarm Civilians","Run a Con","Armed Robbery","Traffick Illegal Arms","Threaten & Blackmail","Human Trafficking","Terrorism","Vigilante Justice","Train Combat","Train Hacking","Train Charisma","Territory Warfare"]
		// if between 0 and 20 assign to best task for each person. (static for now)
		if (ns.gang.getGangInformation().wantedLevel >= 1 && ns.gang.getGangInformation().wantedLevel <= wantedlevelmax) {
			for (let i = 0; i < gangmembers.length; ++i) {
				ns.gang.setMemberTask(gangmembers[i], tasknames[3]);
			}
		} else {
			// set everyone to Vigilante Justice
			while (ns.gang.getGangInformation().wantedLevel > 1) {
				for (let i = 0; i < gangmembers.length; ++i) {
					ns.gang.setMemberTask(gangmembers[i], tasknames[10]);
				}
				await ns.sleep(20);
			}
		}

		// alternate idea - only assign just enough vig just too keep wanted gain -
		// loop though all members
		//   let wantedLevelGainRate = ns.gang.getGangInformation().wantedLevelGainRate
		//   if wantedLevelGainRate <= 0
		//     assign money task
		//   else
		//

		await ns.sleep(20);
	}

	ns.tprint("Not in gang yet.");
}