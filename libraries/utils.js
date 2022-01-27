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
export async function getmostprofitable(ns) {
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

	const augments = [
		"BitWire",
		"Artificial Bio-neural Network Implant",
		"Artificial Synaptic Potentiation",
		"Enhanced Myelin Sheathing",
		"Synaptic Enhancement Implant",
		"Neural-Retention Enhancement",
		"DataJack",
		"Embedded Netburner Module",
		"Embedded Netburner Module Core Implant",
		"Embedded Netburner Module Core V2 Upgrade",
		"Embedded Netburner Module Core V3 Upgrade",
		"Embedded Netburner Module Analyze Engine",
		"Embedded Netburner Module Direct Memory Access Upgrade",
		"Neuralstimulator",
		"Neural Accelerator",
		"Cranial Signal Processors - Gen I",
		"Cranial Signal Processors - Gen II",
		"Cranial Signal Processors - Gen III",
		"Cranial Signal Processors - Gen IV",
		"Cranial Signal Processors - Gen V",
		"Neuronal Densification",
		"FocusWire",
		"PC Direct-Neural Interface",
		"PC Direct-Neural Interface Optimization Submodule",
		"PC Direct-Neural Interface NeuroNet Injector",
		"ADR-V1 Pheromone Gene",
		"ADR-V2 Pheromone Gene",
		"The Shadow's Simulacrum",
		"Neurotrainer I",
		"Neurotrainer II",
		"Neurotrainer III",
		"HyperSight Corneal Implant",
		"Power Recirculation Core",
		"QLink",
		"SPTN-97 Gene Modification",
		"ECorp HVMind Implant",
		"SmartJaw",
		"Xanipher",
		"nextSENS Gene Modification",
		"OmniTek InfoLoad",
		"BitRunners Neurolink",
		"The Black Hand",
		"CRTX42-AA Gene Modification",
		"Neuregen Gene Modification",
		"PCMatrix",
		"Social Negotiation Assistant (S.N.A)",
	];

	const playeraugs = ns.getOwnedAugmentations(true);

	for (const augment of augments) {
		if (playeraugs.includes(augment) === false && ns.getServerMoneyAvailable('home') >= ns.getAugmentationPrice(augment) && ns.getAugmentationRepReq(augment) <= ns.gang.getGangInformation().respect) {
			ns.purchaseAugmentation(factions[0], augment);
			ns.print("Purchased: " + augment);
		}
	}
}