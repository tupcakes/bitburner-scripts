/** @param {NS} ns **/
export function countPrograms(ns) {
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

	return count;
}


/** @param {NS} ns **/
// try to open every port we can
function breakPorts(ns, hostname) {
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