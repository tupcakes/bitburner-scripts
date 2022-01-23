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

					let newram = currentserverram + currentserverram

					for (let i = 0; i < pservs.length; ++i) {
						while (ns.serverExists("pserv-" + newram + "GB-" + i)) {
							i++;
						}
						let newname = ns.purchaseServer("pserv-" + newram + "GB-" + i, newram);
					}
				}
			}
		}
	}
}