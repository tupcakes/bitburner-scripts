/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		await ns.sleep(1000);
		ns.run('/stocks/dash-stocks.js');
		ns.run('/stocks/pricetracker.js');
		//ns.run('/stocks/manipulate.js');

		// wait for pricetracker to generate some data
		await ns.sleep(120000);
		// buyer and seller do basic long market order trading
		ns.run('/stocks/seller.js');
		ns.run('/stocks/buyer.js');
	}
}