/** @param {NS} ns **/
export async function main(ns) {
	let targetserver = "joesguns";

	var currentServers = ns.getPurchasedServers();
	var scriptram = ns.getScriptRam("weaken.js");

	while (true) {
		for (var i = 0; i < currentServers.length; ++i) {
			var serv = currentServers[i];

			var maxRam = ns.getServerMaxRam(serv);
			var maxnumthreads = parseInt(maxRam / scriptram);

			await ns.scp('weaken.js', serv);
			ns.exec('weaken.js', serv, maxnumthreads, targetserver, 0);
		}
		await ns.sleep(500);
	}
}