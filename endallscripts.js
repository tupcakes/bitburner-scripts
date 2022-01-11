/** @param {NS} ns **/
export async function main(ns) {
	let servers = ns.getPurchasedServers();

	// kill running scripts on home
	ns.tprint("Killing scripts on: home");
	ns.scriptKill('control.js', 'home');
	ns.scriptKill('control-home.js', 'home');
	ns.scriptKill('root_all.js', 'home');
	ns.scriptKill('/earlygame/attack_local.js', 'home');
	ns.scriptKill('/buy/servers.js', 'home');

	// kill scripts running on pservs
	for (let i = 0; i < servers.length; ++i) {
		ns.tprint("Killing scripts on: " + servers[i]);
		ns.killall(servers[i]);
	}
}