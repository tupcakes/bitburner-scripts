//import { lowerpricedist, raisepricedist } from "/libraries/stocks.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');

	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	while (true) {
		await ns.sleep(20);
		let stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));

		for (const stock of stocks) {
			let position = ns.stock.getPosition(stock.sym);
			let sellprice = position[1] + (position[1] * .25);
			let avg = (stock.high + stock.low) / 2;
			// let sellprice = avg + (avg * .05);

			// check if we have shares in the stock.  if so check if price is good to sell.
			if (ns.stock.getPosition(stock.sym)[0] !== 0) {
				if (ns.stock.getPrice(stock.sym) >= sellprice) {
					let selltimeprice = ns.stock.sell(stock.sym, ns.stock.getPosition(stock.sym)[0]);
					ns.print(stock.sym + ":selling:   " + "@" + dollarUS.format(selltimeprice.toFixed(2)));
					ns.print(stock.sym + ":sellprice: " + dollarUS.format(sellprice.toFixed(2)));
					ns.print(stock.sym + ":High/low:  " + dollarUS.format(stock.high.toFixed(2)) + "/" + dollarUS.format(stock.low.toFixed(2)));
					ns.print(stock.sym + ":PAverage:  " + dollarUS.format(position[1].toFixed(2)));
				}
			}
		}
	}
}