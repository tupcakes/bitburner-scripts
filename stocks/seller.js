//import { lowerpricedist, raisepricedist } from "/libraries/stocks.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	let highmultiplier = .90; // might want to change .75
	let lowmultiplier = 1.10; // might want to change 1.25

	while (true) {
		await ns.sleep(20);
		let stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));

		for (const stock of stocks) {
			let avg = (stock.high + stock.low) / 2;
			let sellprice = avg + (avg * .25);
			// let sellprice = stock.high * highmultiplier;

			// check if we have shares in the stock.  if so check if price is good to sell.
			if (ns.stock.getPosition(stock.sym)[0] !== 0) {
				if (ns.stock.getPrice(stock.sym) >= sellprice) {
					let selltimeprice = ns.stock.sell(stock.sym, ns.stock.getPosition(stock.sym)[0]);
					ns.print(stock.sym + ":selling:   " + "@" + selltimeprice.toFixed(2));
					ns.print(stock.sym + ":sellprice: " + sellprice.toFixed(2));
					ns.print(stock.sym + ":High/low:  " + stock.high.toFixed(2) + "/" + stock.low.toFixed(2));
					ns.print(stock.sym + ":average:   " + avg.toFixed(2));
				}
			}
		}
	}
}