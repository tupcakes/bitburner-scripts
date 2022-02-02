/** @param {NS} ns **/
export async function main(ns) {
	// get all pservs
	let pserv = ns.getPurchasedServers();

	let servers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	const runningon = ns.getHostname();

	for (let i = 0; i < servers.length; ++i) {
		let hackinglevel = ns.getHackingLevel();
		let ServerRequiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		let ServerMaxMoney = ns.getServerMaxMoney(servers[i].name);

		if (ServerRequiredHackingLevel <= hackinglevel && ServerMaxMoney > 0 && ns.hasRootAccess(servers[i].name) == true) {
			ns.exec("control.js", runningon, 1, servers[i].name);
		} else {
			ns.print("Server " + servers[i].name + " has too high of a security level or has no money. Skipping.");
		}
	}
}