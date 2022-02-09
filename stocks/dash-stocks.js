/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');

	while (true) {
		await ns.sleep(1000);
		ns.clearLog();
		Math.floor(Math.random() * 1000)

		let symbols = ns.stock.getSymbols();

		ns.print("Sym-----Shares-----AvgPrc-----CntPrc")

		for (const sym of symbols) {
			if (ns.stock.getPosition(sym)[0] !== 0) {
				ns.print(sym + "     " + ns.stock.getPosition(sym)[0] + "       " + ns.stock.getPosition(sym)[1].toFixed(2) + "    " + ns.stock.getPrice(sym).toFixed(2));
			}
		}		

	}
}