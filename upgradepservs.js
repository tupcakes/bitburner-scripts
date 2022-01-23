/** @param {NS} ns **/
export async function main(ns) {
	let moneytokeep = 1000000000;

	while (true) {
		await ns.sleep(20);

		let pservs = ns.getPurchasedServers();

		if (pservs.length === 24) {
			for (const pserv of pservs) {
				let currentserverram = ns.getServerMaxRam(pserv);

				if (ns.getServerMaxMoney('home') > moneytokeep) {
					ns.killall(pserv);
					ns.deleteServer(pserv);
					ns.purchaseServer(pserv, currentserverram + currentserverram);
				}
			}
		}
	}
}