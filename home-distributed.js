/** @param {NS} ns **/
export async function main(ns) {
	// get all pservs
	let pserv = ns.getPurchasedServers();
	// read in server file
	let file = ns.read("server_list.txt");
	let servers = file.split("\r\n");

	const runningon = ns.getHostname();

	for (let i = 0; i < servers.length; ++i) {
		let server = JSON.stringify(servers[i].split(",")).replace('["', '').replace('"]', '');

		let hackinglevel = ns.getHackingLevel();
		let ServerRequiredHackingLevel = ns.getServerRequiredHackingLevel(server);
		let ServerMaxMoney = ns.getServerMaxMoney(server);

		if (ServerRequiredHackingLevel <= hackinglevel && ServerMaxMoney > 0) {
			ns.exec("control.js", 'runningon', 1, server);
		} else {
			ns.tprint("Server " + server + " has too high of a security level or has no money. Skipping.");
		}
	}
}