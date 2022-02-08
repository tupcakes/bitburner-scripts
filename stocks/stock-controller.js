import { lowerprice, raiseprice } from "/libraries/stocks.js";

/** @param {NS} ns **/
export async function main(ns) {
	let sym = 'FNS';
	let target = 'foodnstuff';
	let lowprice = 2500;
	let highprice = 2900;
	let shares = 5000;

	//while (true) {
		await ns.sleep(20);

		// place long stop buy order
		ns.stock.placeOrder(sym, shares, lowprice, 'StopBuy', 'Long');

		// lower price until target price is reached
		await lowerprice(ns, target, sym, lowprice);

		// place long stop sell order
		ns.stock.placeOrder(sym, shares, highprice, 'StopSell', 'Long');

		// raise price until target price is reached
		await raiseprice(ns, target, sym, highprice);
	//}
}