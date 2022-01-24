/** @param {NS} ns **/
export async function updatefiles(ns) {
	let refreshfiles_pid = ns.run('/helpers/refreshfiles.js', 1);
	while (ns.isRunning(refreshfiles_pid) === true) {
		ns.clearLog();
		ns.print("Updating files.")
		await ns.sleep(20);
		continue;
	}
	ns.print("Done updating files.");
}
