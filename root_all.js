/** @param {NS} ns **/
export async function main(ns) {
	function countPrograms() {
		let count = 0;

		if (ns.fileExists("BruteSSH.exe"))
			count++;
		if (ns.fileExists("FTPCrack.exe"))
			count++;
		if (ns.fileExists("relaySMTP.exe"))
			count++;
		if (ns.fileExists("HTTPWorm.exe"))
			count++;
		if (ns.fileExists("SQLInject.exe"))
			count++;

		//ns.print(count);

		return count;
	}

	// try to open every port we can
	function breakPorts(hostname) {
		if (ns.fileExists("BruteSSH.exe"))
			ns.brutessh(hostname);
		if (ns.fileExists("FTPCrack.exe"))
			ns.ftpcrack(hostname);
		if (ns.fileExists("relaySMTP.exe"))
			ns.relaysmtp(hostname);
		if (ns.fileExists("HTTPWorm.exe"))
			ns.httpworm(hostname);
		if (ns.fileExists("SQLInject.exe"))
			ns.sqlinject(hostname);
	}

	ns.disableLog('ALL');

	let file = ns.read("server_list.txt");
	let targets = file.split("\r\n");

	while (true) {
		for (let i = 0; i < targets.length; ++i) {
			let target = JSON.stringify(targets[i].split(",")).replace('["', '').replace('"]', '');
			if (ns.hasRootAccess(target)) {
				await ns.sleep(20);
				continue;
			}
			if (countPrograms() >= ns.getServerNumPortsRequired(target)) {
				breakPorts(target);
				ns.nuke(target);
				ns.tprint("Hacked: " + target);
				ns.print("Hacked: " + target);
			}
			await ns.sleep(20);
		}
		await ns.sleep(20);
	}
}