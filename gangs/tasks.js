/** 
 * assigns a task for each person. it will assign
 * Vigilante Justice if wanted level gets too high.
**/

/** @param {NS} ns **/
export async function main(ns) {
	let noascend = ns.args[0];
	let nobuy = ns.args[1];

	ns.tail();
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	// kill training
	ns.scriptKill('/gangs/training.js', 'home');


	// SET THESE
	//let wantedpenthreshold = .995;
	let wantedlevelmax = 1000;
	let equipbuythreshold = 10000000000;
	let ascensionthreashold = 2;


	let vigillaties = true
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


		// Buy equipment
		if (nobuy !== 'nobuy') {
			let equipmentnames = ns.gang.getEquipmentNames();
			let purchased = false;

			for (let i = 0; i < equipmentnames.length; ++i) {
				//ns.tprint(ns.gang.getEquipmentType(equipmentnames[i]));
				for (let j = 0; j < gangmembers.length; ++j) {
					// buy if less than 5 mil
					if (ns.gang.getEquipmentCost(equipmentnames[i]) < equipbuythreshold) {
						purchased = ns.gang.purchaseEquipment(gangmembers[j], equipmentnames[i]);
					}
					if (purchased === true) {
						ns.print(gangmembers[j] + " " + equipmentnames[i]);
					}
				}
			}
		}


		// Ascension
		if (noascend !== 'noascend') {
			for (let i = 0; i < gangmembers.length; ++i) {
				let ascensionresult = ns.gang.getAscensionResult(gangmembers[i]);
				// if not capable of ascending goto next member
				if (typeof ascensionresult === 'undefined') {
					continue;
				}

				// if stats are good enough, ascend.
				if (ascensionresult.str >= ascensionthreashold || ascensionresult.def >= ascensionthreashold || ascensionresult.dex >= ascensionthreashold || ascensionresult.agi >= ascensionthreashold) {
					ns.gang.ascendMember(gangmembers[i]);
				}
			}
		}


		// Task assignment
		gangmembers = ns.gang.getMemberNames();
		let tasknames = ns.gang.getTaskNames();
		// ["Unassigned","Mug People","Deal Drugs","Strongarm Civilians","Run a Con","Armed Robbery","Traffick Illegal Arms","Threaten & Blackmail","Human Trafficking","Terrorism","Vigilante Justice","Train Combat","Train Hacking","Train Charisma","Territory Warfare"]
		// if between 0 and wantedlevelmax assign task for each person.
		//if (ns.gang.getGangInformation().wantedPenalty <= wantedpenthreshold && ns.gang.getGangInformation().wantedPenalty >= 1) {
		if (ns.gang.getGangInformation().wantedLevel >= 1 && ns.gang.getGangInformation().wantedLevel <= wantedlevelmax) {
			// set gang member's task to something
			// 8 - Human Trafficking seems to be the best all around for territory gains
			// 9 - Terrorism for best respect gains
			for (let i = 0; i < gangmembers.length; ++i) {
				ns.gang.setMemberTask(gangmembers[i], tasknames[8]);
				//ns.gang.setMemberTask(gangmembers[i], tasknames[6]);

			}
		} else {
			// set everyone to Vigilante Justice if wanted level is too high
			while (ns.gang.getGangInformation().wantedLevel > 1) {
				for (let i = 0; i < gangmembers.length; ++i) {
					ns.gang.setMemberTask(gangmembers[i], tasknames[10]);
				}
				await ns.sleep(20);
			}
		}

		await ns.sleep(20);
	}

	ns.tprint("Not in gang yet.");
}