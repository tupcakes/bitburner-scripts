/** 
 * super basic script that runs a task for each person. it will assign
 * Vigilante Justice if wanted level gets too high.
**/

/** @param {NS} ns **/
export async function main(ns) {

	// kill training
	ns.scriptKill('/gangs/gang-training.js', 'home');

	let wantedlevelmax = 1000;

	let ingang = ns.gang.inGang();
	let ganginfo = ns.gang.getGangInformation();
	let gangmembers = ns.gang.getMemberNames();

	// if we are in a gang? loop
	while (ingang) {
		// check if we can recruit a member
		if (ns.gang.canRecruitMember() == true) {
			// check if name already exists
			gangmembers = ns.gang.getMemberNames();
			for (let i = 0; i < gangmembers.length; ++i) {
				if (gangmembers.includes('Thug-' + i)) {
					continue;
				} else {
					let newname = 'Thug-' + i;
					ns.gang.recruitMember(newname);
					ns.tprint(newname + " recruited.")
					break;
				}
			}
		}


		// buy members equipment
		gangmembers = ns.gang.getMemberNames();
		let equipmentnames = ns.gang.getEquipmentNames();
		for (let i = 0; i < equipmentnames.length; ++i) {
			//ns.tprint(ns.gang.getEquipmentType(equipmentnames[i]));
			for (let j = 0; j < gangmembers.length; ++j) {
				// if hacking gang, buy rootkits
				if (ns.gang.getEquipmentType(equipmentnames[i]) === 'Rootkit' && ganginfo.isHacking === true) {
						ns.gang.purchaseEquipment(gangmembers[j], equipmentnames[i]);
				// if combat gang, buy combat equipment
				} else {
					ns.gang.purchaseEquipment(gangmembers[j], equipmentnames[i]);
				}

			}
		}


		gangmembers = ns.gang.getMemberNames();
		let tasknames = ns.gang.getTaskNames()
		// ["Unassigned","Mug People","Deal Drugs","Strongarm Civilians","Run a Con","Armed Robbery","Traffick Illegal Arms","Threaten & Blackmail","Human Trafficking","Terrorism","Vigilante Justice","Train Combat","Train Hacking","Train Charisma","Territory Warfare"]
		// if between 0 and 20 assign last task for each person.
		if (ns.gang.getGangInformation().wantedLevel >= 1 && ns.gang.getGangInformation().wantedLevel <= wantedlevelmax) {
			// get evenyone's current task
			let currenttasks = [];
			for (let i = 0; i < gangmembers.length; ++i) {
				currenttasks.push(ns.gang.getMemberInformation(gangmembers[i]).task);
			}
			// 
			for (let i = 0; i < gangmembers.length; ++i) {
				ns.gang.setMemberTask(gangmembers[i], tasknames[8]);


			}
			ns.gang.setMemberTask(gangmembers[0], 'Territory Warfare');
		} else {
			// set everyone to Vigilante Justice if wanted level is too high
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