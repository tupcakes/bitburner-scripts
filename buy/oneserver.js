/** @param {NS} ns **/
export async function main(ns) {

	// How much RAM each purchased server will have.
	let ram = ns.args[0];

	// get files to copy
	let files = ns.ls('home', ".js");
	files.push('server_list.txt');

	if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
		ns.tprint("Already purchased max servers.");
		return;
	}

	let i = 0;
	if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
		while (ns.serverExists("pserv-" + i + "-" + ram + "GB")) {
			i++;
		}
		let pserv = ns.purchaseServer("pserv-" + i + "-" + ram + "GB", ram);

		// copy scripts from home
		for (let i = 0; i < files.length; i++) {
			ns.print(pserv + ": " + files[i]);
			ns.rm(files[i], pserv);
			// get new copies
			await ns.scp(files[i], pserv);
			await ns.sleep(20);
		}

		i++;
	} else {
		ns.tprint("Not enough Money.")
	}
}