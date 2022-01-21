/** 
 * assigns a task for each person. it will assign
 * Vigilante Justice if wanted level gets too high.
**/

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	// kill training
	ns.scriptKill('/gangs/training.js', 'home');

	let wantedlevelmax = 10;

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
					continue;
				} else {
					ns.gang.recruitMember(newmember);
					ns.tprint(newmember + " recruited.")
					break;
				}
			}
		}


		// // Buy equipment
		// let equipmentnames = ns.gang.getEquipmentNames();
		// let purchased = false;

		// for (let i = 0; i < equipmentnames.length; ++i) {
		// 	//ns.tprint(ns.gang.getEquipmentType(equipmentnames[i]));
		// 	for (let j = 0; j < gangmembers.length; ++j) {
		// 		purchased = ns.gang.purchaseEquipment(gangmembers[j], equipmentnames[i]);
		// 		if (purchased === true) {
		// 			ns.print(gangmembers[j] + " " + equipmentnames[i]);
		// 		}
		// 	}
		// }


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
				ns.gang.setMemberTask(gangmembers[i], tasknames[3]);

				// find a way to assign the best task
				// needs formulas api!!!!
				// let taskmoneygain = 0
				// for each task {
				//   if (taskmoneygain > ns.formulas.moneyGain(ns.gang.getGangInformation(), gangmembers[i], ns.gang.getTaskStats(tasknames[j]));) {
				//     let tasktodo = tasknames[j];
				//   }
				// }
				// do task

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