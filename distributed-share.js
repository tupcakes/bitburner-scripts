/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	let scriptram = ns.getScriptRam("/helpers/share.js");
	let rootableservers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	while (true) {
		await ns.sleep(20);
		// build list of usable servers
		let usableservers = [];

		// add all rootable servers that have ram and we have root on
		for (const rootableserver of rootableservers) {
			if (ns.getServerMaxRam(rootableserver.name) > 0 && ns.hasRootAccess(rootableserver.name)) {
				usableservers.push(rootableserver.name);
			}
		}


		for (let i = 0; i < usableservers.length; ++i) {
			await ns.sleep(20);
			if (ns.scriptRunning("/helpers/share.js", usableservers[i]) === true) {
				continue;
			}
			let availableram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
			let maxnumthreads = parseInt(availableram / scriptram);

			ns.print("usableserver:   " + usableservers[i]);
			ns.print("ServerMaxRam:   " + ns.getServerMaxRam(usableservers[i]));
			ns.print("ServerUsedRam:  " + ns.getServerUsedRam(usableservers[i]));
			ns.print("availableram:   " + availableram);
			ns.print("scriptram:      " + scriptram);
			ns.print("maxnumthreads:  " + maxnumthreads);
			ns.print("");
			
			if (availableram >= (scriptram * maxnumthreads)) {
				ns.exec('/helpers/share.js', usableservers[i], maxnumthreads);
			}
		}
	}
}