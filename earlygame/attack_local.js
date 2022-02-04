/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let scriptram = ns.getScriptRam("/earlygame/early-hack-template.js");

	let servers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	// kill running scripts
	for (let i = 0; i < servers.length; ++i) {
		// Kill any running scripts
		ns.killall(servers[i].name);
	}

	while (true) {
		await ns.sleep(5000);
		for (let i = 0; i < servers.length; ++i) {

			// check if we are running the batch script against this server
			if (ns.getRunningScript('/earlygame/early-control.js', 'home', servers[i].name) || ns.getRunningScript('control.js', 'home', servers[i].name)) {
				ns.kill('/earlygame/early-hack-template.js', servers[i].name, servers[i].name);
				continue;
			}


			let ServerRequiredHackingLevel = ns.getServerRequiredHackingLevel(servers[i].name);
			let HackingLevel = ns.getHackingLevel(servers[i].name);
			let ServerMaxMoney = ns.getServerMaxMoney(servers[i].name);
			let ServerMaxRam = ns.getServerMaxRam(servers[i].name);
			let RootAccess = ns.hasRootAccess(servers[i].name);

			if (ServerMaxMoney > 0 && HackingLevel >= ServerRequiredHackingLevel && ServerMaxRam > scriptram) {
				// check if it already has root access, if not nuke it
				if (RootAccess == false) {
					ns.print("Getting root.");
					ns.run("/helpers/get_root.js", 1, servers[i].name);
				} else {
					// copy the hacking script over
					await ns.scp("/earlygame/early-hack-template.js", servers[i].name);

					// figure out how many threads we can run of our script
					let maxnumthreads = parseInt(ServerMaxRam / scriptram);
					ns.print("maxRam: " + ServerMaxRam);
					ns.print("scriptram: " + scriptram);
					ns.print("maxnumthreads: " + maxnumthreads);
					ns.print("Running on: " + servers[i].name + "-Threads:" + maxnumthreads + "-HackLevel:" + ServerRequiredHackingLevel);

					// execute script on the target server
					ns.exec("/earlygame/early-hack-template.js", servers[i].name, maxnumthreads, servers[i].name);
				}
			}
		}
	}
}
