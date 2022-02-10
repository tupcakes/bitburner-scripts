/** @param {NS} ns **/
export async function main(ns) {
	let targetserver = ns.args[0];
	let targetsymbol = ns.args[1];

	let weakenram = ns.getScriptRam("/helpers/weakenstock.js");
	let hackram = ns.getScriptRam("/helpers/hackstock.js");

	let controllerram = ns.getScriptRam("/stocks/stock-controller.js");
	let sellerram = ns.getScriptRam("/stocks/seller.js");
	let buyerram = ns.getScriptRam("/stocks/buyer.js");
	let dashram = ns.getScriptRam("/stocks/dash-stocks.js");
	let mainpram = ns.getScriptRam("/stocks/simple-manip.js");
	let weakenstockram = ns.getScriptRam("/stocks/simple-weaken-stock.js");
	let rootallram = ns.getScriptRam("root-all.js");
	let ramoverhead = (sellerram + + buyerram + controllerram + dashram + mainpram + weakenstockram + rootallram) - 2;

	let weakenthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / weakenram) / 2);
	let hackthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / hackram) / 2);

	let timeoffset = 500;
	let hacktime = 0;

	while (ns.stock.getPosition(targetsymbol)[0] > 0) {
		await ns.sleep(20);

		let weakentime = ns.getWeakenTime(targetserver) + timeoffset;
		hacktime = ns.getHackTime(targetserver) + timeoffset;

		ns.run('/helpers/weakenstock.js', weakenthreads, targetserver, 0);
		await ns.sleep(weakentime);

		ns.run('/helpers/hackstock.js', hackthreads, targetserver, 0);
		await ns.sleep(hacktime);
	}
}