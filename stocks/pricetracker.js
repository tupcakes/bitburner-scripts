import { lowerpricedist, raisepricedist } from "/libraries/stocks.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	let symbols = ns.stock.getSymbols();
	let stocks = [];

	if (ns.fileExists('/stocks/stocks.json.txt') === false) {
		ns.print("Stock file doesn't exist yet. Creating price tracking.");
		// init the file with symbols and current price as high and low
		for (const sym of symbols) {
			const stock = new Object
			stock.sym = sym;
			stock.high = ns.stock.getPrice(sym);
			stock.low = ns.stock.getPrice(sym);
			stocks.push(stock);
		}
		await ns.write('/stocks/stocks.json', JSON.stringify(stocks), "w");
	} else {
		ns.print("Stock file exits. Importing prices.");
		stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));
	}


	// update file high and low values
	while (true) {
		await ns.sleep(20);

		for (let i = 0; i < stocks.length; i++) {
			// update high
			if (ns.stock.getPrice(stocks[i].sym) > stocks[i].high) {
				stocks[i].high = ns.stock.getPrice(stocks[i].sym);
			}

			// update low
			if (ns.stock.getPrice(stocks[i].sym) < stocks[i].low) {
				stocks[i].low = ns.stock.getPrice(stocks[i].sym);
			}
		}
		await ns.write('/stocks/stocks.json', JSON.stringify(stocks), "w");
	}
}