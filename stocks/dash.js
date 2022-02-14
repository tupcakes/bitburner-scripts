/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');

	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	const startingmoney = ns.getServerMoneyAvailable('home');

	while (true) {
		await ns.sleep(1000);
		ns.clearLog();

		let totalinvested = 0;
		let totalworth = 0;
		let prctchange = 0;

		let symbols = ns.stock.getSymbols();

		for (const sym of symbols) {
			let position = ns.stock.getPosition(sym);
			if (position[0] !== 0) {
				totalinvested = totalinvested + (ns.stock.getPosition(sym)[1] * ns.stock.getPosition(sym)[0]);
				totalworth = totalworth + (ns.stock.getBidPrice(sym) * ns.stock.getPosition(sym)[0]);
			}
		}

		prctchange = ((totalworth + ns.getServerMoneyAvailable('home') - startingmoney) / startingmoney) * 100;

		ns.print("Staring Money    " + dollarUS.format(startingmoney));
		ns.print("Total Inv:       " + dollarUS.format(totalinvested));
		ns.print("Total Inv Worth: " + dollarUS.format(totalworth));
		ns.print("Total Assets:    " + dollarUS.format(totalworth + ns.getServerMoneyAvailable('home')));
		ns.print("% Change:        " + prctchange.toFixed(2));

		ns.print(Math.floor(Math.random() * 1000));
	}
}