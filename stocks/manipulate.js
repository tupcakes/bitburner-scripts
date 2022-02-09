/** @param {NS} ns **/
export async function main(ns) {
	/**
	 * get list of all stocks from file
	 * for each stock symbol
	 * 	if we have own shares
	 * 		grow stock
	 * 
	 * 	if we don't own shares
	 * 		weaken stock
	 */

	let targets = JSON.parse(ns.read("/stocks/sym-server-map.json.txt"));


	let pservs = ns.getPurchasedServers();
	let maxpservs = (pservs.length * 2) - 1;

	if (pservs.length === 0) {
		ns.tprint("Need pservs.");
		return;
	}
	// if (ns.getServerMaxRam('home') < 256) {
	// 	ns.tprint("Home needs more ram.");
	// 	return;
	// }

	while (true) {
		await ns.sleep(20);

		for (let i = 0; i < maxpservs; ++i) {
			let position = ns.stock.getPosition(targets[i].sym);

			// if we own the stock grow it
			if (postion[0] !== 0) {
				ns.run("/stocks/grow-stock.js", 1, targets[i].server);
			}

			// if we don't own the stock weaken it
			if (postion[0] !== 0) {
				ns.run("/stocks/weaken-stock.js", 1, targets[i].server);
			}
		}

	}

}