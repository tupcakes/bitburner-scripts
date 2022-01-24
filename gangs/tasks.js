/** 
 * assigns a task for each person. it will assign
 * Vigilante Justice if wanted level gets too high.
**/

import { newgangmember, buygangequipment, ascendgangmember } from "/libraries/gangs.js";

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


	let ingang = ns.gang.inGang();
	let ganginfo = ns.gang.getGangInformation();

	// if we are in a gang? loop
	while (ingang) {
		let gangmembers = ns.gang.getMemberNames();

		// check if we can recruit a member
		newgangmember(ns);


		// Buy equipment
		buygangequipment(ns);


		// Ascension
		ascendgangmember(ns);


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