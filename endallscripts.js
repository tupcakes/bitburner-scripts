/** @param {NS} ns **/
export async function main(ns) {
	// build list of usable servers
	let usableservers = [];
	usableservers.push("home");

	let file = ns.read("server_list.txt");
	let rootableservers = file.split("\r\n");


	// add all rootable servers that have ram and we have root on
	for (const rootableserver of rootableservers) {
		if (ns.getServerMaxRam(rootableserver) > 0 && ns.hasRootAccess(rootableserver)) {
			usableservers.push(rootableserver);
		}
	}

	let pservs = ns.getPurchasedServers();
	for (const pserv of pservs) {
		usableservers.push(pserv);
	}

	for (const server of usableservers) {
		let scripts = ns.ps(server);
		for (let i = 0; i < scripts.length; ++i) {
			if (scripts[i].filename !== 'endallscripts.js') {
				ns.scriptKill(scripts[i].filename, server);
				ns.tprint("Killall: " + scripts[i].filename + " on " + server);
			}
		}
	}

}