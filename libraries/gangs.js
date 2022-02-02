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
				//ns.print(gangmembers[j] + " " + equipmentnames[i]);
			}
		}
	}
}


/** @param {NS} ns **/
export function ascendgangmember(ns) {
	let gangmembers = ns.gang.getMemberNames();
	let ascensionthreashold = 1.6;
	for (let i = 0; i < gangmembers.length; ++i) {
		// if member is not actively training
		if (ns.gang.getMemberInformation(gangmembers[i]).task.includes('Train') === false) {
			let ascensionresult = ns.gang.getAscensionResult(gangmembers[i]);
			// if not capable of ascending goto next member
			if (typeof ascensionresult === 'undefined') {
				continue;
			}

			// if stats are good enough, ascend.
			if (ascensionresult.hack >= ascensionthreashold || ascensionresult.cha >= ascensionthreashold || ascensionresult.str >= ascensionthreashold || ascensionresult.def >= ascensionthreashold || ascensionresult.dex >= ascensionthreashold || ascensionresult.agi >= ascensionthreashold) {
				ns.gang.ascendMember(gangmembers[i]);
				ns.print("Experience based ascend: " + gangmembers[i]);
			}
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


/** @param {NS} ns **/
export function trainmember(ns, gangmember) {
	let ascensionthreashold = 1.1;
	let hack = 0;
	let str = 0;
	let def = 0;
	let dex = 0;
	let agi = 0;
	let cha = 0;

	let ascensionresult = ns.gang.getAscensionResult(gangmember);

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
	if (str >= ascensionthreashold && def >= ascensionthreashold && dex >= ascensionthreashold && agi >= ascensionthreashold) {
		ns.gang.setMemberTask(gangmember, 'Train Combat');
	} else if (cha < ascensionthreashold) {
		ns.gang.setMemberTask(gangmember, 'Train Charisma');
	} else if (hack < ascensionthreashold) {
		ns.gang.setMemberTask(gangmember, 'Train Hacking');
	} else {
		ns.gang.ascendMember(gangmember);
		ns.print("Training based ascend: " + gangmember);
	}
}


/** @param {NS} ns **/
export function trainforht(ns, gangmember) {
	let ascensionthreashold = 1.1;
	let hack = 0;
	let str = 0;
	let def = 0;
	let dex = 0;
	let agi = 0;
	let cha = 0;

	let ascensionresult = ns.gang.getAscensionResult(gangmember);

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

	let memberinfo = ns.gang.getMemberInformation(gangmember);

	if (dex >= ascensionthreashold && cha >= ascensionthreashold && hack >= ascensionthreashold) {
		ns.gang.ascendMember(gangmember);
		ns.print("Training based ascend: " + gangmember);
	} else if (memberinfo.dex_mult < 2.5) {
		ns.gang.setMemberTask(gangmember, 'Train Combat');
	} else if (memberinfo.cha_mult < 2.5) {
		ns.gang.setMemberTask(gangmember, 'Train Charisma');
	} else if (memberinfo.hack_mult < 2.5) {
		ns.gang.setMemberTask(gangmember, 'Train Hacking');
	}
}


/** @param {NS} ns **/
export function readyforhumantrafficking(ns, gangmember) {
	let memberinfo = ns.gang.getMemberInformation(gangmember);

	// if HT stat multipliers are good enough, approve for crime
	if (memberinfo.hack_asc_mult >= 2.5 && memberinfo.dex_asc_mult >= 2.5 && memberinfo.cha_asc_mult >= 2.5) {
		return true;
	} else {
		return false;
	}
}