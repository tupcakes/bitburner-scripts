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
			//let sellthresh = position[1] + (position[1] * .10);
			let avg = (stock.high + stock.low) / 2;
			let sellthresh = avg + (avg * .10);

			// check if we have shares in the stock.  if so check if price is good to sell.
			if (position[0] !== 0) {
				if (ns.stock.getPrice(stock.sym) >= sellthresh) {
					let d = new Date();
					d.toLocaleTimeString();

					ns.print(d.toLocaleTimeString() + " Selling: " + dollarUS.format(ns.stock.getPrice(stock.sym).toFixed(2)) + ">=" + dollarUS.format(sellthresh.toFixed(2)))

					let selltimeprice = ns.stock.sell(stock.sym, position[0]);
					let profit = (position[0] * selltimeprice) - (position[0] * position[1])
					ns.print(d.toLocaleTimeString() + " " + stock.sym + ":selling:    " + position[0] + "@" + dollarUS.format(selltimeprice.toFixed(2)));
					ns.print(d.toLocaleTimeString() + " " + stock.sym + ":sellthresh: " + dollarUS.format(sellthresh.toFixed(2)));
					ns.print(d.toLocaleTimeString() + " " + stock.sym + ":High/low:   " + dollarUS.format(stock.high.toFixed(2)) + "/" + dollarUS.format(stock.low.toFixed(2)));
					ns.print(d.toLocaleTimeString() + " " + stock.sym + ":PAverage:   " + dollarUS.format(position[1].toFixed(2)));
					ns.print(d.toLocaleTimeString() + " " + stock.sym + ":Profit:     " + dollarUS.format(profit.toFixed(2)));
				}
			}
		}
	}
}