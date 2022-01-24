/** @param {NS} ns **/
export async function main(ns) {
	// build list of usable servers
	let usableservers = [];
	usableservers.push("home");

	let pservs = ns.getPurchasedServers();
	// add all rootable servers that have ram and we have root on
	for (const rootableserver of rootableservers) {
		if (ns.getServerMaxRam(rootableserver) > 0 && ns.hasRootAccess(rootableserver)) {
			usableservers.push(rootableserver);
		}
	}
	for (const pserv of pservs) {
		usableservers.push(pserv);
	}

	for (const server of usableservers) {
		ns.killall(server);
	}
}