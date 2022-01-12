/** @param {NS} ns **/
export async function main(ns) {
	// get all pservs
	let pserv = ns.getPurchasedServers();
	// read in server file
	let file = ns.read("server_list.txt");
	let servers = file.split("\r\n");
	let targetindex = 0;
	let counter = 0;
	let pservindex = 0;
	
	if (ns.getServerMaxRam(pserv[0]) > == 1024) {
		let batchsize = 2;
	} else if (ns.getServerMaxRam(pserv[0]) > == 2048) {
		let batchsize = 4;
	}
	

	while (pservindex < pserv.length) {
		//await ns.sleep(500);
		counter = 0;

		ns.tprint("Pserv------------" + pserv[pservindex]);

		while (counter < batchsize) {
			// check if there are any more targets in the list
			if (targetindex == 69) {
				ns.tprint("Processed " + targetindex + " targets.");
				ns.scriptKill(ns.getScriptName(), ns.getHostname());
				break;
			}

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