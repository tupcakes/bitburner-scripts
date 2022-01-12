/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let scriptram = ns.getScriptRam("/earlygame/early-hack-template.js");
	
	// read in server file
	let file = ns.read("server_list.txt");
	let servers = file.split("\r\n");

	// kill running scripts
	for (let i = 0; i < servers.length; ++i) {
		// Kill any running scripts
		ns.killall(servers[i]);
	}

	while (true) {
		await ns.sleep(5000);
		for (let i = 0; i < servers.length; ++i) {
			let server = JSON.stringify(servers[i].split(",")).replace('["', '').replace('"]', '');

			// check if we are running the batch script against this server
			if (ns.getRunningScript('control-home.js', 'home', server) || ns.getRunningScript('control.js', 'home', server) || ns.getRunningScript('/earlygame/early-run.js', 'home', server)) {
				ns.kill('/earlygame/early-hack-template.js', server, server);
				continue;
			}


			let ServerRequiredHackingLevel = ns.getServerRequiredHackingLevel(server);
			let HackingLevel = ns.getHackingLevel(server);
			let ServerMaxMoney = ns.getServerMaxMoney(server);
			let ServerMaxRam = ns.getServerMaxRam(server);
			let RootAccess = ns.hasRootAccess(server);

			if (ServerMaxMoney > 0) {
				// check if we have the required skill to hack the server
				if (HackingLevel >= ServerRequiredHackingLevel) {
					// only run on servers with more than scriptram ram
					if (ServerMaxRam > scriptram) {
						// check if it already has root access, if not nuke it
						if (RootAccess == false) {
							ns.print("Getting root.");
							ns.run("get_root.js", 1, server);
						} else {
							// copy the hacking script over
							await ns.scp("/earlygame/early-hack-template.js", server);

							// figure out how many threads we can run of our script
							var maxnumthreads = parseInt(ServerMaxRam / scriptram);
							ns.print("maxRam: " + ServerMaxRam);
							ns.print("scriptram: " + scriptram);
							ns.print("maxnumthreads: " + maxnumthreads);
							ns.print("Running on: " + server + "-Threads:" + maxnumthreads + "-HackLevel:" + ServerRequiredHackingLevel);

							// execute script on the target server
							ns.exec("/earlygame/early-hack-template.js", server, maxnumthreads, server);
						}
					}
				}
			}
		}
	}
}