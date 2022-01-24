/** @param {NS} ns **/
export async function main(ns) {
	let moneytokeep = 1000000000;

	while (true) {
		await ns.sleep(20);

		let pservs = ns.getPurchasedServers();

		if (pservs.length === 25) {
			for (const pserv of pservs) {
				let currentserverram = ns.getServerMaxRam(pserv);

				if (ns.getServerMoneyAvailable('home') > moneytokeep) {
					ns.killall(pserv);
					ns.deleteServer(pserv);

					let newram = currentserverram + currentserverram
					let index = pserv.slice(-1);
					ns.purchaseServer("pserv-" + newram + "GB-" + index, newram);
				}
			}
		}
	}
}