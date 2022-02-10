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
		await ns.sleep(1000);
		ns.clearLog();
		
		let stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));
		//let symbols = ns.stock.getSymbols();

		ns.print("Sym-----Shares-----AvgPrc-----CntPrc------SellThrsh");

		for (const stock of stocks) {
			let position = ns.stock.getPosition(stock.sym);
			if (position[0] !== 0) {
				let avg = (stock.high + stock.low) / 2;
				let sellthresh = avg + (avg * .10);
				//ns.print(sym + "     " + ns.stock.getPosition(sym)[0] + "       " + ns.stock.getPosition(sym)[1].toFixed(2) + "    " + ns.stock.getPrice(sym).toFixed(2) + "      " + sellprice.toFixed(2));
				ns.print(stock.sym + "     " + position[0] + "       " + position[1].toFixed(2) + "    " + ns.stock.getPrice(stock.sym).toFixed(2) + "      " + sellthresh.toFixed(2));
			}
		}
		ns.print(Math.floor(Math.random() * 1000));
	}
}