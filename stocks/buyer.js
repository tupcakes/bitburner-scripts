//import { lowerpricedist, raisepricedist } from "/libraries/stocks.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	let highmultiplier = .75; // .90 might want to change .75
	let lowmultiplier = 1.25; // 1.10 might want to change 1.25

	while (true) {
		await ns.sleep(20);
		let stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));

		for (const stock of stocks) {
			let avg = (stock.high + stock.low) / 2;
			let buyprice = avg - (avg * .25);
			// let buyprice = stock.low * lowmultiplier;

			// check if we have shares. if so check if price is good to buy.
			if (ns.stock.getPosition(stock.sym)[0] === 0) {
				if (ns.stock.getPrice(stock.sym) <= buyprice) {
					if (ns.getServerMoneyAvailable('home') >= ns.stock.getPurchaseCost(stock.sym, 1000, 'Long')) {
						let buytimeprice = ns.stock.buy(stock.sym, 1000);
						ns.print(stock.sym + ":buying:   " + "@" + buytimeprice.toFixed(2));
						ns.print(stock.sym + ":buyprice: " + buyprice.toFixed(2));
						ns.print(stock.sym + ":High/low: " + stock.high.toFixed(2) + "/" + stock.low.toFixed(2));
						ns.print(stock.sym + ":average:   " + avg.toFixed(2));
					}
				}
			}
		}
	}
}