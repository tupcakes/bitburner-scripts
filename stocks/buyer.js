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

	let shares = 750;

	while (true) {
		await ns.sleep(20);
		let stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));

		for (const stock of stocks) {
			let avg = (stock.high + stock.low) / 2;
			let buythresh = avg - (avg * .10);

			// check if we have shares. if so check if price is good to buy.
			if (ns.stock.getPosition(stock.sym)[0] === 0) {
				if (ns.stock.getPrice(stock.sym) <= buythresh) {
					if (ns.getServerMoneyAvailable('home') >= ns.stock.getPurchaseCost(stock.sym, shares, 'Long')) {
						let buytimeprice = ns.stock.buy(stock.sym, shares);
						ns.print(stock.sym + ":buying:      " + "@" + dollarUS.format(buytimeprice.toFixed(2)));
						ns.print(stock.sym + ":buythresh:   " + dollarUS.format(buythresh.toFixed(2)));
						ns.print(stock.sym + ":High/low:    " + dollarUS.format(stock.high.toFixed(2)) + "/" + dollarUS.format(stock.low.toFixed(2)));
						ns.print(stock.sym + ":H/L average: " + dollarUS.format(avg.toFixed(2)));
					} else {
						ns.print("Not enough $");
					}
				}
			}
		}
	}
}