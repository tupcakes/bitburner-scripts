/** @param {NS} ns **/
export async function main(ns) {
	// var targetserver = "joesguns"
	// var targetserver = "zer0";
	// var targetserver = "neo-net";
	// var targetserver = "omega-net";
	// var targetserver = "max-hardware";
	// var targetserver = "phantasy";
	let targetserver = "the-hub";

	let currentServers = ns.getPurchasedServers();
	let scriptram = ns.getScriptRam("early-hack-template.js");

	for (var i = 0; i < currentServers.length; ++i) {
		var serv = currentServers[i];
		ns.killall(serv);

		var maxRam = ns.getServerMaxRam(serv);
		var maxnumthreads = parseInt(maxRam / scriptram);
		
		await ns.scp('early-hack-template.js', serv);
		ns.exec('early-hack-template.js', serv, maxnumthreads, targetserver);
	}
}