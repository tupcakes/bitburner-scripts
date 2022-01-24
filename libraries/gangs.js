/** @param {NS} ns **/
export function newgangmember(ns) {
	// check if we can recruit a member
	if (ns.gang.canRecruitMember() == true) {
		// check if name already exists
		let gangmembers = ns.gang.getMemberNames();
		for (let i = 0; i < gangmembers.length + 1; ++i) {
			let newmember = 'Thug-' + i;
			if (gangmembers.includes(newmember) === true) {
				continue;
			} else {
				ns.gang.recruitMember(newmember);
				ns.tprint("Recruited: " + newmember);
				return newmember;
			}
		}
	}
}


/** @param {NS} ns **/
export function buygangequipment(ns) {
	let equipbuythreshold = 10000000000;
	let equipmentnames = ns.gang.getEquipmentNames();
	let gangmembers = ns.gang.getMemberNames();
	let purchased = false;

	for (let i = 0; i < equipmentnames.length; ++i) {
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


/** @param {NS} ns **/
export function ascendgangmember(ns) {
	let gangmembers = ns.gang.getMemberNames();
	let ascensionthreashold = 2;
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


/** @param {NS} ns **/
// returns true if a warfare tick just happened.
export async function warfaretick(ns) {
	let otherganginfo = ns.gang.getChanceToWinClash('The Black Hand');
	while (true) {
		await ns.sleep(20);
		let otherganginfoupdate = ns.gang.getChanceToWinClash('The Black Hand');
		if (otherganginfo !== otherganginfoupdate) {
			return true;
		}
	}
	
}