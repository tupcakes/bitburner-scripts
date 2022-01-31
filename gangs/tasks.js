/** 
 * assigns a task for each person. it will assign
 * Vigilante Justice if wanted level gets too high.
 * will wait for warfare tick and schedule warfare
 * just before the tick so power increases.
 * will start warfare if lowest chance is > 60.
**/

import { newgangmember, buygangequipment, ascendgangmember, warfaretick, getbesttask, trainmember } from "/libraries/gangs.js";

/** @param {NS} ns **/
export async function main(ns) {

	ns.tail();
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	// kill training
	ns.scriptKill('/gangs/training.js', 'home');


	// SET THESE
	//let wantedlevelmax = 100;


	const gangs = [
		"Slum Snakes",
		"Speakers for the Dead",
		"The Black Hand",
		"The Dark Army",
		"The Syndicate",
		"NiteSec",
		"Tetrads",
	];


	let ingang = ns.gang.inGang();
	let ganginfo = ns.gang.getGangInformation();

	// if we are in a gang? loop
	while (ingang) {
		let wantedlevelmax = 100;
		ganginfo = ns.gang.getGangInformation();
		let wantedpenalty = ((1 - ganginfo.wantedPenalty) * 100).toFixed(2);
		let gangmembers = ns.gang.getMemberNames();

		// check if we can recruit a member
		newgangmember(ns);


		// Buy equipment
		buygangequipment(ns);


		// Ascension
		ascendgangmember(ns);


		// get chance to win as array of objects
		let chances = [];
		let lowestchance = Math.min(chances);
		for (const gang of gangs) {
			let ChanceToWinClash = ns.gang.getChanceToWinClash(gang);
			// skip my gang
			if (gang === ns.gang.getGangInformation().faction) {
				continue;
			}
			chances.push(ChanceToWinClash);
		}

		lowestchance = Math.min(...chances);
		// ready for war
		if (lowestchance >= .55) {
			ns.gang.setTerritoryWarfare(true);
		}
		// we won
		let territory = ns.gang.getGangInformation().territory;
		if (territory === 1) {
			ns.gang.setTerritoryWarfare(false);
		}
		// war is not going well. regroup
		if (territory < .10) {
			ns.gang.setTerritoryWarfare(false);
		}


		// wait for tick
		if (territory < 1) {
			await warfaretick(ns);
		}

		// Task assignment
		gangmembers = ns.gang.getMemberNames();
		let tasknames = ns.gang.getTaskNames();

		// ["Unassigned","Mug People","Deal Drugs","Strongarm Civilians","Run a Con","Armed Robbery","Traffick Illegal Arms","Threaten & Blackmail","Human Trafficking","Terrorism","Vigilante Justice","Train Combat","Train Hacking","Train Charisma","Territory Warfare"]
		// if between 0 and wantedlevelmax assign task for each person.
		//if (ns.gang.getGangInformation().wantedLevel >= 1 && ns.gang.getGangInformation().wantedLevel <= wantedlevelmax) {
		if (wantedpenalty == 0) {
			// set gang member's task to something
			for (let i = 0; i < gangmembers.length; ++i) {
				// if the member can do HT, then do it. otherwise train up.
				if (getbesttask(ns, gangmembers[i]) !== 'Human Trafficking' && gangmembers.length > 6) {
					trainmember(ns, gangmembers[i]);
				} else {
					ns.gang.setMemberTask(gangmembers[i], getbesttask(ns, gangmembers[i]));
				}
			}
		} else if (wantedpenalty != 0 && ns.gang.getGangInformation().wantedLevel <= wantedlevelmax) {
			// set gang member's task to something
			for (let i = 0; i < gangmembers.length; ++i) {
				// if the member can do HT, then do it. otherwise train up.
				if (getbesttask(ns, gangmembers[i]) !== 'Human Trafficking' && gangmembers.length > 6) {
					trainmember(ns, gangmembers[i]);
				} else {
					ns.gang.setMemberTask(gangmembers[i], getbesttask(ns, gangmembers[i]));
				}
			}
		} else {
			// set everyone to Vigilante Justice if wanted level is too high
			while (ns.gang.getGangInformation().wantedLevel > 1) {

				await warfaretick(ns);

				for (let i = 0; i < gangmembers.length; ++i) {
					ns.gang.setMemberTask(gangmembers[i], tasknames[10]);
				}

				if (ns.gang.getGangInformation().territory < 1) {
					await ns.sleep(18500);
					for (let i = 0; i < gangmembers.length; ++i) {
						ns.gang.setMemberTask(gangmembers[i], 'Territory Warfare');
					}
				} else {
					await ns.sleep(20);
				}
			}
		}

		// if we haven't won the war,
		// do work for 18 seconds, then set to territory warfare until next tick
		if (ns.gang.getGangInformation().territory < 1) {
			await ns.sleep(18500);
			for (let i = 0; i < gangmembers.length; ++i) {
				ns.gang.setMemberTask(gangmembers[i], 'Territory Warfare');
			}
		}


		await ns.sleep(20);
	}

	ns.tprint("Not in gang yet.");
}