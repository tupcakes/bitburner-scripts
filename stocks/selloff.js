/** @param {NS} ns **/
export async function main(ns) {
	let symbols = ns.stock.getSymbols();
	let total = 0;

	for (const sym of symbols) {
		let position = ns.stock.getPosition(sym);
		ns.stock.sell(sym, position[0]);
		ns.stock.sellShort(sym, position[2]);
	}
}