/** @param {NS} ns **/
export async function main(ns) {
	let symbols = ns.stock.getSymbols();
	let canshort = true;

	ns.scriptKill('/stocks/start-stocks.js', 'home');
	ns.scriptKill('/stocks/stock-trader.js', 'home');
	ns.scriptKill('/stocks/early-stock-trader.js', 'home');
	ns.scriptKill('/stocks/manipulate.js', 'home');

	for (const sym of symbols) {
		let position = ns.stock.getPosition(sym);
		ns.stock.sell(sym, position[0]);

		if (canshort) {
			ns.stock.sellShort(sym, position[2]);
		}
	}
}