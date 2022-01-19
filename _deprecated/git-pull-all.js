/** @param {NS} ns **/
export async function main(ns) {
	let pserv = ns.getPurchasedServers();
	pserv.unshift('home');

ns.tprint(pserv.length);

	for (let i = 0; i < pserv.length; ++i) {
		ns.exec("git-pull.js", pserv[i], 1);
	}
}