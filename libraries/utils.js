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


/** @param {NS} ns **/
export async function copyfiles(ns, target) {
	let files = ns.ls('home', ".js");
    files.push('server_list.txt');

	// copy scripts
	for (let i = 0; i < files.length; i++) {
		ns.print(target + ": " + files[i]);
		ns.rm(files[i], target);
		// get new copies
		await ns.scp(files[i], target);
		await ns.sleep(20);
	}
}


/** @param {NS} ns **/
export async function getportopeners(ns) {
	// buy tor router
	ns.purchaseTor();
	ns.purchaseProgram("BruteSSH.exe");
	ns.purchaseProgram("FTPCrack.exe");
	ns.purchaseProgram("relaySMTP.exe");
	ns.purchaseProgram("HTTPWorm.exe");
	ns.purchaseProgram("SQLInject.exe");
}