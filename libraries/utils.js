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
	files.push('server_list.txt');

	// copy scripts
	for (let i = 0; i < files.length; i++) {
		// ns.print(target + ": " + files[i]);
		ns.rm(files[i], target);
		// get new copies
		await ns.scp(files[i], target);
		await ns.sleep(20);
	}
}


/** @param {NS} ns **/
export async function createexes(ns) {
	const programs = [
		"BruteSSH.exe",
		"FTPCrack.exe",
		"relaySMTP.exe",
		"HTTPWorm.exe",
		"SQLInject.exe",
		// "DeepscanV1.exe",
		// "DeepscanV2.exe",
		// "AutoLink.exe",
		// "ServerProfiler.exe",
	];


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
	let file = ns.read("server_list.txt");
	let servers = file.split("\r\n");
	let stats = [];


	for (let i = 0; i < servers.length; ++i) {
		let server = JSON.stringify(servers[i].split(",")).replace('["', '').replace('"]', '');

		// only check if the server can have money and is hackable
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(server) && ns.getServerMaxMoney(server) > 0) {
			let weakentime = ns.getWeakenTime(server) * 2;
			let growtime = ns.getGrowTime(server);
			let hacktime = ns.getHackTime(server);
			let totaltime = (weakentime + growtime + hacktime) / 1000;
			let moneyperhack = ns.hackAnalyze(server);
			let moneypersec = moneyperhack / totaltime;

			const stat = new Object
			stat.name = server;
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
	const factions = [
		"Slum Snakes",
		"CyberSec",
		"Tian Di Hui",
		"Netburners",
		"Sector-12",
		"Chongqing",
		"New Tokyo",
		"Ishima",
		"Aevum",
		"Volhaven",
		"NiteSec",
		"The Black Hand",
		"BitRunners",
		"ECorp",
		"MegaCorp",
		"KuaiGong International",
		"Four Sigma",
		"NWO",
		"Blade Industries",
		"OmniTek Incorporated",
		"Bachman & Associates",
		"Clarke Incorporated",
		"Fulcrum Secret Technologies",
		"Tetrads",
		"Silhouette",
		"Speakers for the Dead",
		"The Dark Army",
		"The Syndicate",
		"The Covenant",
		"Daedalus",
		"Illuminati",
	];

	// const augments = [
	// 	"BitWire",
	// 	"Artificial Bio-neural Network Implant",
	// 	"Artificial Synaptic Potentiation",
	// 	"Enhanced Myelin Sheathing",
	// 	"Synaptic Enhancement Implant",
	// 	"Neural-Retention Enhancement",
	// 	"DataJack",
	// 	"Embedded Netburner Module",
	// 	"Embedded Netburner Module Core Implant",
	// 	"Embedded Netburner Module Core V2 Upgrade",
	// 	"Embedded Netburner Module Core V3 Upgrade",
	// 	"Embedded Netburner Module Analyze Engine",
	// 	"Embedded Netburner Module Direct Memory Access Upgrade",
	// 	"Neuralstimulator",
	// 	"Neural Accelerator",
	// 	"Cranial Signal Processors - Gen I",
	// 	"Cranial Signal Processors - Gen II",
	// 	"Cranial Signal Processors - Gen III",
	// 	"Cranial Signal Processors - Gen IV",
	// 	"Cranial Signal Processors - Gen V",
	// 	"Neuronal Densification",
	// 	"FocusWire",
	// 	"PC Direct-Neural Interface",
	// 	"PC Direct-Neural Interface Optimization Submodule",
	// 	"PC Direct-Neural Interface NeuroNet Injector",
	// 	"ADR-V1 Pheromone Gene",
	// 	"ADR-V2 Pheromone Gene",
	// 	"The Shadow's Simulacrum",
	// 	"Neurotrainer I",
	// 	"Neurotrainer II",
	// 	"Neurotrainer III",
	// 	"HyperSight Corneal Implant",
	// 	"Power Recirculation Core",
	// 	"QLink",
	// 	"SPTN-97 Gene Modification",
	// 	"ECorp HVMind Implant",
	// 	"SmartJaw",
	// 	"Xanipher",
	// 	"nextSENS Gene Modification",
	// 	"OmniTek InfoLoad",
	// 	"BitRunners Neurolink",
	// 	"The Black Hand",
	// 	"CRTX42-AA Gene Modification",
	// 	"Neuregen Gene Modification",
	// 	"PCMatrix",
	// 	"Social Negotiation Assistant (S.N.A)",
	// 	"The Red Pill",
	// 	// "Hacknet Node CPU Architecture Neural-Upload",
	// 	// "Hacknet Node Cache Architecture Neural-Upload",
	// 	// "Hacknet Node NIC Architecture Neural-Upload",
	// 	// "Hacknet Node Kernel Direct-Neural Interface",
	// 	// "Hacknet Node Core Direct-Neural Interface",
	// ];

	const ssaugs = ns.getAugmentationsFromFaction('Slum Snakes');
	const playeraugs = ns.getOwnedAugmentations(true);
	const daedalusaugs = ns.getAugmentationsFromFaction('Daedalus');
	const sec12augs = ns.getAugmentationsFromFaction('Sector-12');

	// buy augs from daedalus
	for (const augment of daedalusaugs) {
		if (playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.gang.getGangInformation().respect) {
			// ns.purchaseAugmentation('Daedalus', 'NeuroFlux Governor');
			ns.purchaseAugmentation('Daedalus', augment);
		}
	}

	// buy from Sector-12 if in BN2
	if (ns.getPlayer().bitNodeN === 2) {
		for (const augment of sec12augs) {
			if (playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.gang.getGangInformation().respect) {
				ns.purchaseAugmentation('Sector-12', augment);
			}
		}
	}

	// buy from gang, but not augs from daedalus or sec12
	for (const augment of ssaugs) {
		if (daedalusaugs.includes(augment) === false && sec12augs.includes(augment) === false && playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.gang.getGangInformation().respect) {
			ns.purchaseAugmentation('Slum Snakes', augment);
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
	let file = ns.read("server_list.txt");
	let servers = file.split("\r\n");
	let xpstats = [];

	for (let i = 0; i < servers.length; ++i) {
		let server = JSON.stringify(servers[i].split(",")).replace('["', '').replace('"]', '');
		let serverxp = ns.formulas.hacking.hackExp(ns.getServer(server), ns.getPlayer());
		const stat = new Object
		stat.name = server;
		stat.xp = serverxp;
		xpstats.push(stat);
	}

	let bestserver = xpstats.reduce((max, stat) => max.serverxp > stat.serverxp ? max : stat);
	return bestserver.name;
}