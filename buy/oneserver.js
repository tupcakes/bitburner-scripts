/** @param {NS} ns **/
export async function main(ns) {

	// How much RAM each purchased server will have.
	var ram = ns.argsp[0];

	// Iterator we'll use for our loop
	var i = 0;
	// Continuously try to purchase servers until we've reached the maximum
	// amount of servers
	if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
		while (ns.serverExists("pserv-" + i)) {
			i++;
		}
		let serv = ns.purchaseServer(("pserv-" + i), ram);

		// copy scripts
		await ns.scp('git-pull.js', ("pserv-" + i));
		await ns.scp('server_list.txt', ("pserv-" + i));
		ns.exec('git-pull.js', ("pserv-" + i), 1)

		i++;
	} else {
		ns.tprint("Not enough Money.")
	}
	await ns.sleep(3000);
}