/** @param {NS} ns **/
export async function main(ns) {
	var currentServers = ns.getPurchasedServers();

	for (var i = 0; i < currentServers.length; ++i) {
		var serv = currentServers[i];
		//ns.scriptKill("early-hack-template.js", serv);
		ns.killall(serv);
		ns.deleteServer(serv);
	}
}