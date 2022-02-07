/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();
	while (true) {
		await ns.sleep(20);

		let allupgraded = false;

		// buy nodes up to limit
		if (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()) {
			ns.hacknet.purchaseNode();
		}
		if (ns.hacknet.numNodes() === 0) {
			continue;
		}


		// if node stats aren't at max attempt upgrade
		for (let i = 0; i < ns.hacknet.numNodes(); i++) {
			if (ns.hacknet.getNodeStats(i).level < 200) { // level - max 200
				ns.hacknet.upgradeLevel(i, 1);
			}
			if (ns.hacknet.getNodeStats(i).ram < 64) { // ram - max 64
				ns.hacknet.upgradeRam(i, 1);
			}
			if (ns.hacknet.getNodeStats(i).cores < 16) {// cores - max 16
				ns.hacknet.upgradeCore(i, 1);
			}
			if (ns.hacknet.getNodeStats(i).cache < 4) {// cache - max ?
				ns.hacknet.upgradeCache(i, 1);
			}
		}

		// if cache is getting full buy something
		ns.hacknet.spendHashes('Sell for Money');
	}
}