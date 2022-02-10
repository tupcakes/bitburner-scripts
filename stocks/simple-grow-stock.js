/** @param {NS} ns **/
export async function main(ns) {
	let targetserver = ns.args[0];
	let targetsymbol = ns.args[1];
	
	let weakenram = ns.getScriptRam("/helpers/weaken1.js");
	let growram = ns.getScriptRam("/helpers/growstock.js");
	let hackram = ns.getScriptRam("/helpers/hack.js");
	
	let controllerram = ns.getScriptRam("/stocks/stock-controller.js");
	let sellerram = ns.getScriptRam("/stocks/seller.js");
	let buyerram = ns.getScriptRam("/stocks/buyer.js");
	let dashram = ns.getScriptRam("/stocks/dash-stocks.js");
	let mainpram = ns.getScriptRam("/stocks/simple-manip.js");
	let growstockram = ns.getScriptRam("/stocks/simple-grow-stock.js");
	let rootallram = ns.getScriptRam("root-all.js");
	let ramoverhead = (sellerram + + buyerram + controllerram + dashram + mainpram + growstockram + rootallram) - 2;

	let weakenthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / weakenram) / 2);
	let growthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / growram) / 2);
	let hackthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / hackram) / 2);

	let timeoffset = 500;
	let weakentime = 0;


	while (ns.stock.getPosition(targetsymbol)[0] !== 0) {
		await ns.sleep(20);

		weakentime = ns.getWeakenTime(targetserver) + timeoffset;
		let growtime = ns.getGrowTime(targetserver) + timeoffset;
		let hacktime = ns.getHackTime(targetserver) + timeoffset;

		ns.run('/helpers/weaken1.js', weakenthreads, targetserver, 0);
		await ns.sleep(weakentime);

		ns.run('/helpers/growstock.js', growthreads, targetserver, 0);
		await ns.sleep(growtime);

		// ns.run('/helpers/weaken2.js', weakenthreads, targetserver, 0);
		// await ns.sleep(weakentime);

		// ns.run('/helpers/hack.js', hackthreads, targetserver, 0);
		// await ns.sleep(hacktime);
	}
}