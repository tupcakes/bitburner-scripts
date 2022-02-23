/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	while (true) {
		await ns.sleep(20);
		let files = ns.ls('home', ".js");
		files.push('serversbyhacklvl.json.txt');

		let allupgraded = false;

		// if warfare has started stop buying node upgrades
		if (ns.gang.inGang()) {
			if (ns.gang.getGangInformation().territoryWarfareEngaged) {
				return;
			}
		}

		// buy nodes up to limit
		if (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes() && ns.getServerMoneyAvailable('home') >= ns.hacknet.getPurchaseNodeCost()) {
			let nodeidx = ns.hacknet.purchaseNode();
			let nodename = ns.hacknet.getNodeStats(nodeidx).name

			// copy scripts
			for (let i = 0; i < files.length; i++) {
				ns.print(nodename + ": " + files[i]);
				ns.rm(files[i], nodename);
				// get new copies
				await ns.scp(files[i], nodename);
				await ns.sleep(20);
			}
			// update server list
			ns.run('createserverlist.js');
		}
		if (ns.hacknet.numNodes() === 0) {
			continue;
		}


		// if node stats aren't at max attempt upgrade
		for (let i = 0; i < ns.hacknet.numNodes(); i++) {
			// if (ns.gang.getGangInformation().territory < .99) {
			ns.hacknet.upgradeLevel(i, 1);
			ns.hacknet.upgradeRam(i, 1);
			ns.hacknet.upgradeCore(i, 1);
			ns.hacknet.upgradeCache(i, 1);
			// } else {
			// 	ns.hacknet.upgradeRam(i, 1);
			// }
		}

		// if cache is getting full buy something
		// if has corp and not in warfare
		if (ns.getPlayer().hasCorporation) {
			if (ns.gang.inGang()) {
				if (ns.gang.getGangInformation().territoryWarfareEngaged === false) {
					ns.hacknet.spendHashes('Sell for Corporation Funds');
					if (ns.hacknet.hashCost('Sell for Corporation Funds') > 2500) {
						//ns.softReset('start.js');
					}
				}
			} else {
				ns.hacknet.spendHashes('Sell for Corporation Funds');
				if (ns.hacknet.hashCost('Sell for Corporation Funds') > 2500) {
					//ns.softReset('start.js');
				}
			}
		} else {
			ns.hacknet.spendHashes('Sell for Money');
		}
	}
}