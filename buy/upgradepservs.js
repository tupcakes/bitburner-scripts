/** @param {NS} ns **/
export async function main(ns) {
	let pservs = ns.getPurchasedServers();
	if (pservs.length !== 25) {
		ns.tprint("You don't have 25 servers.");
		return;
	}

	while (true) {
		await ns.sleep(20);

		for (let i = 0; i < pservs.length; ++i) {
			let currentserverram = ns.getServerMaxRam(pservs[i]);
			// if ram of last server is greater than ram of current, then upgrade
			if (ns.getServerMaxRam(pservs[i - 1]) > currentserverram) {
				ns.killall(pservs[i]);
				ns.deleteServer(pservs[i]);
				let newram = currentserverram + currentserverram
				ns.purchaseServer("pserv-" + i + "-" + newram + "GB", newram);
			}
			
			// check if last server has been upgraded, quit if true
			if (ns.getServerMaxRam(pservs.length) === newram) {
				ns.tprint("All servers upgraded to " + newram);
				return;
			}
		}
	}
}