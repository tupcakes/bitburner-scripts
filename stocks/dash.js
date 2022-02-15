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
		let totalinvworth = 0;

		let totalinvestedlong = 0;
		let totalinvestedshort = 0;

		let totalinvworthlong = 0;
		let totalinvworthshort = 0;
		let prctchange = 0;

		let symbols = ns.stock.getSymbols();

		for (const sym of symbols) {
			let position = ns.stock.getPosition(sym);
			if (position[0] !== 0) {
				totalinvestedlong = totalinvestedlong + (position[0] * position[1]);
				totalinvworthlong = totalinvworthlong + ns.stock.getSaleGain(sym, position[0], 'Long');
			} else if (position[2] != 0) {
				totalinvestedshort = totalinvestedshort + (position[2] * position[3]);
				totalinvworthshort = totalinvworthshort + ns.stock.getSaleGain(sym, position[2], 'Short');
			}
		}

		totalinvested = totalinvestedlong + totalinvestedshort;
		totalinvworth = totalinvworthlong + totalinvworthshort;


		prctchange = ((totalinvworth + ns.getServerMoneyAvailable('home') - startingmoney) / startingmoney) * 100;

		ns.print("-----TOTAL-----");
		ns.print("Staring Money    " + dollarUS.format(startingmoney));
		ns.print("Total Inv:       " + dollarUS.format(totalinvested));
		ns.print("Total Inv Worth: " + dollarUS.format(totalinvworth));
		ns.print("% Change:        " + prctchange.toFixed(2));

		ns.print("-----LONG-----");
		ns.print("Total Inv:       " + dollarUS.format(totalinvestedlong));
		ns.print("Total Inv Worth: " + dollarUS.format(totalinvworthlong));
		ns.print("Total Assets:    " + dollarUS.format(totalinvworthlong + ns.getServerMoneyAvailable('home')));
		
		ns.print("-----SHORT-----");
		ns.print("Total Inv:       " + dollarUS.format(totalinvestedshort));
		ns.print("Total Inv Worth: " + dollarUS.format(totalinvworthshort));
		ns.print("Total Assets:    " + dollarUS.format(totalinvworthshort + ns.getServerMoneyAvailable('home')));

		ns.print(Math.floor(Math.random() * 1000));
	}
}