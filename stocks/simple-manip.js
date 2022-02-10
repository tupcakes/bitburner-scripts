import { lowerprice, raiseprice } from "/libraries/stocks.js";

export function autocomplete(data, args) {
	return data.servers;
}

/** @param {NS} ns **/
export async function main(ns) {
//	ns.disableLog('ALL');

	let targets = JSON.parse(ns.read("/stocks/sym-server-map.json.txt"));

	while (true) {
		await ns.sleep(20);
		ns.run('root-all.js')

		for (let i = 0; i < targets.length; ++i) {
			let position = ns.stock.getPosition(targets[i].sym);
			// if we own the stock grow it
			if (position[0] !== 0) {
				if (ns.hasRootAccess(targets[i].server) === true) {
					//await raiseprice(ns, targets[i].server, targets[i].sym)
					ns.run('/stocks/simple-grow-stock.js', 1, targets[i].server, targets[i].sym);
				}
			}

			// if we don't own the stock weaken it
			if (position[0] === 0) {
				if (ns.hasRootAccess(targets[i].server) === true) {
					//await lowerprice(ns, targets[i].server, targets[i].sym)
					ns.run('/stocks/simple-weaken-stock.js', 1, targets[i].server, targets[i].sym);
				}
			}
		}
	}
}