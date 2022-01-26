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
		ns.print(target + ": " + files[i]);
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