/** 
 * assigns a task for each person. it will assign
 * Vigilante Justice if wanted level gets too high.
**/

/** @param {NS} ns **/
export async function main(ns) {

	// kill training
	ns.scriptKill('/gangs/training.js', 'home');

	let wantedlevelmax = 1000;

	let ingang = ns.gang.inGang();
	let ganginfo = ns.gang.getGangInformation();

	// if we are in a gang? loop
	while (ingang) {
		let gangmembers = ns.gang.getMemberNames();
		
		// check if we can recruit a member
		if (ns.gang.canRecruitMember() == true) {
			// check if name already exists
			gangmembers = ns.gang.getMemberNames();
			for (let i = 0; i < gangmembers.length + 1; ++i) {
				let newmember = 'Thug-' + i;
				if (gangmembers.includes(newmember) === true) {
					ns.tprint(newmember + ' already exists.')
					continue;
				} else {
					ns.gang.recruitMember(newmember);
					ns.tprint(newmember + " recruited.")
					break;
				}
			}
		}


		// Task assignment
		gangmembers = ns.gang.getMemberNames();
		let tasknames = ns.gang.getTaskNames();
		// ["Unassigned","Mug People","Deal Drugs","Strongarm Civilians","Run a Con","Armed Robbery","Traffick Illegal Arms","Threaten & Blackmail","Human Trafficking","Terrorism","Vigilante Justice","Train Combat","Train Hacking","Train Charisma","Territory Warfare"]
		// if between 0 and wantedlevelmax assign task for each person.
		if (ns.gang.getGangInformation().wantedLevel >= 1 && ns.gang.getGangInformation().wantedLevel <= wantedlevelmax) {
			// set gang member's task to something
			// 8 - Human Trafficking seems to be the best all around for territory gains
			// 9 - Terrorism for best respect gains
			for (let i = 0; i < gangmembers.length; ++i) {
				// ns.gang.setMemberTask(gangmembers[i], tasknames[8]);
				ns.gang.setMemberTask(gangmembers[i], tasknames[1]);
				
				// find a way to assign the best task

			}
			//ns.gang.setMemberTask(gangmembers[0], 'Territory Warfare');
		} else {
			// set everyone to Vigilante Justice if wanted level is too high
			while (ns.gang.getGangInformation().wantedLevel > 1) {
				for (let i = 0; i < gangmembers.length; ++i) {
					ns.gang.setMemberTask(gangmembers[i], tasknames[10]);
				}
				//ns.gang.setMemberTask(gangmembers[0], 'Territory Warfare');
				await ns.sleep(20);
			}
		}

		await ns.sleep(20);
	}

	ns.tprint("Not in gang yet.");
}