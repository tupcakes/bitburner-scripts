/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();
	ns.tail();
	
	let nodelimit = 9;
	let allupgraded = false;

	let nodecount = ns.hacknet.numNodes();


	while (allupgraded === false) {
		await ns.sleep(20);
		// buy nodes up to our limit
		while (nodecount < nodelimit) {
			await ns.sleep(20);
			ns.hacknet.purchaseNode();
			nodecount = ns.hacknet.numNodes();
		}

		// build array of nodes and their stats
		let nodes = [];
		for (let i = 0; i < nodecount; ++i) {
			let stats = ns.hacknet.getNodeStats(i);
			const node = new Object
			node.index = nodecount[i];
			node.cores = stats.cores;
			node.ram = stats.ram;
			node.level = stats.level;
			nodes.push(node);
		}

		// if node stats aren't at max attempt upgrade
		for (let i = 0; i < nodes.length; ++i) {
			if (nodes[i].cores < 16) {// cores - max 16
				ns.hacknet.upgradeCore(i, 1);
			}
			if (nodes[i].ram < 64) { // ram - max 64
				ns.hacknet.upgradeRam(i, 1);
			}
			if (nodes[i].level < 200) { // level - max 200
				ns.hacknet.upgradeLevel(i, 1);
			}
			if (nodes[nodelimit - 1].cores === 16 && nodes[nodelimit - 1].ram === 64 && nodes[nodelimit - 1].level === 200) {
				allupgraded = true;
			}
		}
	}
}