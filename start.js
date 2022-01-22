/** @param {NS} ns **/
export async function main(ns) {
	// update files
	let refreshfiles_pid = ns.run('refreshfiles.js', 1);
	while (ns.isRunning(refreshfiles_pid) === true) {
		ns.clearLog();
		ns.print("Updating files.")
		await ns.sleep(20);
		continue;
	}
	ns.print("Done updating files.");
	

	let pservs = ns.getPurchasedServers();

	ns.run("mcp.js");
	ns.run("/gangs/tasks.js");
	ns.run("distributed-share.js");

	if (pservs.length > 0) {
		ns.run("pserv-controller.js");
	}
}