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
	let ascensionthreashold = 1.2;
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


/** @param {NS} ns **/
// a shitty function to try and get best task
export function getbesttask(ns, gangmember) {
	let member = ns.gang.getMemberInformation(gangmember);
	let ganginfo = ns.gang.getGangInformation();

	let tasks = ns.gang.getTaskNames();
	let taskweights = [];
	for (const task of tasks) {
		let taskdetails = ns.gang.getTaskStats(task);
		if (taskdetails.baseMoney === 0) {
			continue;
		}

		let statWeight =
			(taskdetails.hackWeight / 100) * member.hack +
			(taskdetails.strWeight / 100) * member.str +
			(taskdetails.defWeight / 100) * member.def +
			(taskdetails.dexWeight / 100) * member.dex +
			(taskdetails.agiWeight / 100) * member.agi +
			(taskdetails.chaWeight / 100) * member.cha;

		statWeight -= 3.2 * taskdetails.difficulty;
		const territoryMult = Math.max(0.005, Math.pow(ganginfo.territory * 100, taskdetails.territory.money) / 100);
		const territoryPenalty = (0.2 * ganginfo.territory + 0.8)
		const respectMult = ganginfo.respect / (ganginfo.respect + ganginfo.wantedLevel);
		const taskweight = new Object
		taskweight.name = task;
		taskweight.statWeight = taskdetails.baseMoney * statWeight * territoryMult * respectMult;

		taskweights.push(taskweight);
	}

	let besttask = taskweights.reduce((max, taskweight) => max.statWeight > taskweight.statWeight ? max : taskweight);
	return besttask.name;
}