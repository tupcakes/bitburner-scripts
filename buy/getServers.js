/** @param {NS} ns **/
export async function main(ns) {
	let ram = ns.args[0];
	let i = 0;

    // Continuously try to purchase servers until we've reached the maximum
	// amount of servers
	while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            if (ns.serverExists("pserv-" + i)) {
				i++;
			}
            let pserv = ns.purchaseServer("pserv-" + i, ram);

            // copy scripts
            await ns.scp('git-pull.js', pserv);
            await ns.scp('server_list.txt', pserv);
            ns.exec('git-pull.js', pserv, 1)

            i++;
        }
        await ns.sleep(1000);
	}
}