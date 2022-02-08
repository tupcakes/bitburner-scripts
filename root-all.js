/** @param {NS} ns **/
export async function main(ns) {
	let servers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	while (true) {
		await ns.sleep(5000);
		for (let i = 0; i < servers.length; ++i) {
			if (ns.getServerRequiredHackingLevel(servers[i].name) <= ns.getHackingLevel()) {
				// check if it already has root access, if not nuke it
				if (ns.hasRootAccess(servers[i].name) == false) {
					ns.print("Getting root.");
					ns.run("/helpers/get_root.js", 1, servers[i].name);
				}
			}
		}
	}
}