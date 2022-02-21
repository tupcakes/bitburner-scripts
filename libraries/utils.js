/** @param {NS} ns **/
export async function updatefiles(ns) {
	let refreshfiles_pid = ns.run('/helpers/refreshfiles.js', 1);
	while (ns.isRunning(refreshfiles_pid) === true) {
		ns.clearLog();
		ns.print("Updating files.")
		await ns.sleep(20);
		continue;
	}
	ns.print("Done updating files.");
}


/** @param {NS} ns **/
export async function copyfiles(ns, target) {
	let files = ns.ls('home', ".js");
	files.push('serversbyhacklvl.json.txt');

	// copy scripts
	for (let i = 0; i < files.length; i++) {
		ns.rm(files[i], target);
		// get new copies
		await ns.scp(files[i], target);
		await ns.sleep(20);
	}
}


/** @param {NS} ns **/
import { programs } from 'constants.js'
export async function createexes(ns) {


	for (const program of programs) {
		if (ns.isBusy() === false) {
			if (ns.fileExists(program) === false) {
				ns.createProgram(program, false);
			}
		}
	}
}


/** @param {NS} ns **/
export async function getportopeners(ns) {
	// buy tor router
	ns.purchaseTor();
	ns.purchaseProgram("BruteSSH.exe");
	ns.purchaseProgram("FTPCrack.exe");
	ns.purchaseProgram("relaySMTP.exe");
	ns.purchaseProgram("HTTPWorm.exe");
	ns.purchaseProgram("SQLInject.exe");
}


// really shitty method of estimating the most profitable server.
// gets money per sec for a single thread.
/** @param {NS} ns **/
export function getmostprofitable(ns) {
	let servers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	let stats = [];


	for (let i = 0; i < servers.length; ++i) {
		// only check if the server can have money and is hackable
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(servers[i].name) && ns.getServerMaxMoney(servers[i].name) > 0) {
			let weakentime = ns.getWeakenTime(servers[i].name) * 2;
			let growtime = ns.getGrowTime(servers[i].name);
			let hacktime = ns.getHackTime(servers[i].name);
			let totaltime = (weakentime + growtime + hacktime) / 1000;
			let moneyperhack = ns.hackAnalyze(servers[i].name);
			let moneypersec = moneyperhack / totaltime;

			const stat = new Object
			stat.name = servers[i].name;
			stat.moneypersec = moneypersec;
			stat.moneyperhack = moneyperhack;
			stats.push(stat);
		}
	}

	let bestserver = stats.reduce((max, stat) => max.moneypersec > stat.moneypersec ? max : stat);

	return bestserver.name;
}


// buys from the collection of hacking, skill, and rep augments
/** @param {NS} ns **/
export async function buyaugments(ns) {

	let purchased = false;
	const ssaugs = ns.getAugmentationsFromFaction('Slum Snakes');
	const playeraugs = ns.getOwnedAugmentations(true);
	const daedalusaugs = ns.getAugmentationsFromFaction('Daedalus');
	const sec12augs = ns.getAugmentationsFromFaction('Sector-12');

	// if node is not node 2 - buy daedalus
	if (ns.getPlayer().bitNodeN !== 2) {
		for (const augment of ssaugs) {
			if (daedalusaugs.includes(augment) === false && playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.gang.getGangInformation().respect) {
				purchased = ns.purchaseAugmentation('Slum Snakes', augment);
				if (purchased) {
					ns.tprint("Purchased augment: " + augment);
					purchased = false;
				}
			}
		}
		for (const augment of daedalusaugs) {
			if (playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.getFactionRep('Daedalus')) {
				purchased = ns.purchaseAugmentation('Daedalus', augment);
				if (purchased) {
					ns.tprint("Purchased augment: " + augment);
					purchased = false;
				}
			} else {
				purchased = ns.purchaseAugmentation('Daedalus', 'NeuroFlux Governor');
				if (purchased) {
					ns.tprint("Purchased augment: " + augment);
					purchased = false;
				}
			}
		}
	}

	// if node is node 2 - buy Sector-12
	if (ns.getPlayer().bitNodeN === 2) {
		for (const augment of ssaugs) {
			if (sec12augs.includes(augment) === false && playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.gang.getGangInformation().respect) {
				ns.purchaseAugmentation('Slum Snakes', augment);
				ns.tprint("Purchased augment: " + augment);
				purchased = false;
			}
		}
		for (const augment of sec12augs) {
			if (playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.getFactionRep('Sector-12')) {
				ns.purchaseAugmentation('Sector-12', augment);
				ns.tprint("Purchased augment: " + augment);
				purchased = false;
			} else {
				purchased = ns.purchaseAugmentation('Slum Snakes', 'NeuroFlux Governor');
				if (purchased) {
					ns.tprint("Purchased augment: " + augment);
					purchased = false;
				}
			}
		}
	}
}


/** @param {NS} ns **/
export function findavailableserver(ns, script) {
	let file = ns.read("server_list.txt");
	let rootableservers = file.split("\r\n");

	// build list of usable servers
	let usableservers = [];

	let pservs = ns.getPurchasedServers();
	// add all rootable servers that have ram and we have root on
	for (const rootableserver of rootableservers) {
		if (ns.getServerMaxRam(rootableserver) > 0 && ns.hasRootAccess(rootableserver)) {
			usableservers.push(rootableserver);
		}
	}
	// add pservs
	for (const pserv of pservs) {
		usableservers.push(pserv);
	}
	// add home as last option
	usableservers.push("home");


	// find a server to run on
	let scriptram = ns.getScriptRam(script);
	for (let i = 0; i < usableservers.length; ++i) {
		let availableram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
		if (scriptram < availableram) {
			return usableservers[i];
		}
	}

	return 0;
}


/** @param {NS} ns **/
export function runonavailableserver(ns, script, args) {
	let availableserver = findavailableserver(ns, script)
	ns.exec(script, availableserver, 1, args);
}


/** @param {NS} ns **/
export function getbesthackxp(ns) {
	let servers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	let xpstats = [];

	for (let i = 0; i < servers.length; ++i) {
		if (ns.hasRootAccess(servers[i].name) && ns.getServerMaxMoney(servers[i].name) > 0) {
			let serverxp = ns.formulas.hacking.hackExp(ns.getServer(servers[i].name), ns.getPlayer());
			const stat = new Object
			stat.name = servers[i].name;
			stat.xp = serverxp;
			xpstats.push(stat);
		}
	}

	let bestserver = xpstats.reduce((max, stat) => max.serverxp > stat.serverxp ? max : stat);
	return bestserver.name;
}


export function gettime() {
	let date = new Date();
	let time = date.toLocaleString('en-US', {
		// weekday: 'short', // long, short, narrow
		// day: 'numeric', // numeric, 2-digit
		// year: 'numeric', // numeric, 2-digit
		// month: 'long', // numeric, 2-digit, long, short, narrow
		hour: 'numeric', // numeric, 2-digit
		minute: 'numeric', // numeric, 2-digit
		second: 'numeric', // numeric, 2-digit
	});
	return time;
}