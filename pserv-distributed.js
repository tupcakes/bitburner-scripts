/** @param {NS} ns **/
export async function main(ns) {
	// get all pservs
	let pserv = ns.getPurchasedServers();
	// read in server file
	let file = ns.read("server_list.txt");
	let servers = file.split("\r\n");
	let targetindex = 0;
	let batchsize = 4;
	let counter = 0;
	let pservindex = 0;

	while (pservindex < pserv.length) {
		counter = 0;

		// check if there are any more targets in the list
		if (targetindex >= servers.length) {
			ns.scriptKill(ns.getScriptName(), ns.getHostname());
		}

		await ns.sleep(500);
		ns.tprint("Pserv------------" + pserv[pservindex]);

		while (counter < batchsize) {
			await ns.sleep(500);
			let server = JSON.stringify(servers[targetindex].split(",")).replace('["', '').replace('"]', '');
			let hackinglevel = ns.getHackingLevel();
			let ServerRequiredHackingLevel = ns.getServerRequiredHackingLevel(server);
			let ServerMaxMoney = ns.getServerMaxMoney(server);

			// check if we can still add a target to the batch on this pserv. also check if we have the right skill level
			if (ServerRequiredHackingLevel <= hackinglevel && ServerMaxMoney > 0) {
				ns.tprint("Hacking: " + server);
				ns.exec("control-home.js", pserv[pservindex], 1, server);
				counter++;
				targetindex++;
			} else {
				ns.tprint("Server " + server + " has too high of a security level or has no money. Skipping.");
				targetindex++;
			}
		}
		pservindex++;
	}
	ns.scriptKill()
}