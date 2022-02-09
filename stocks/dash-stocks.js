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
		Math.floor(Math.random() * 1000)

		let symbols = ns.stock.getSymbols();

		ns.print("Sym-----Shares-----AvgPrc-----CntPrc------SellPrc");

		for (const sym of symbols) {
			let position = ns.stock.getPosition(sym);
			if (position[0] !== 0) {
				let sellprice = position[1] + (position[1] * .25);
				ns.print(sym + "     " + ns.stock.getPosition(sym)[0] + "       " + ns.stock.getPosition(sym)[1].toFixed(2) + "    " + ns.stock.getPrice(sym).toFixed(2) + "      " + sellprice.toFixed(2));
			}
		}
		ns.print(Math.floor(Math.random() * 1000));
	}
}