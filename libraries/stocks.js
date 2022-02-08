/** @param {NS} ns **/
export async function lowerprice(ns, targetserver, targetsymbol, targetprice) {
	let weakenram = ns.getScriptRam("/helpers/weakenstock.js");
	let hackram = ns.getScriptRam("/helpers/hackstock.js");
	let controllerram = ns.getScriptRam("/stocks/stock-controller.js");

	let weakenthreads = parseInt((ns.getServerMaxRam('home') - controllerram - 5) / weakenram);
	let hackthreads = parseInt((ns.getServerMaxRam('home') - controllerram - 5) / hackram);

	let hacktime = 0;

	while (ns.stock.getPrice(targetsymbol) > targetprice) {
		await ns.sleep(20);

		let weakentime = ns.getWeakenTime(targetserver) + 100;
		hacktime = ns.getHackTime(targetserver) + 100;

		ns.run('/helpers/weakenstock.js', weakenthreads, targetserver, 0);
		await ns.sleep(weakentime);

		ns.run('/helpers/hackstock.js', hackthreads, targetserver, 0);
		await ns.sleep(hacktime);
	}
}


/** @param {NS} ns **/
export async function raiseprice(ns, targetserver, targetsymbol, targetprice) {
	let weakenram = ns.getScriptRam("/helpers/weaken1.js");
	let growram = ns.getScriptRam("/helpers/growstock.js");
	let hackram = ns.getScriptRam("/helpers/hack.js");
	let controllerram = ns.getScriptRam("/stocks/stock-controller.js");

	let weakenthreads = parseInt((ns.getServerMaxRam('home') - controllerram - 5) / weakenram);
	let growthreads = parseInt((ns.getServerMaxRam('home') - controllerram - 5) / growram);
	let hackthreads = parseInt((ns.getServerMaxRam('home') - controllerram - 5) / hackram);

	let weakentime = 0;

	while (ns.stock.getPrice(targetsymbol) < targetprice) {
		await ns.sleep(20);

		weakentime = ns.getWeakenTime(targetserver) + 100;
		let growtime = ns.getGrowTime(targetserver) + 100;
		let hacktime = ns.getHackTime(targetserver) + 100;

		ns.run('/helpers/weaken1.js', weakenthreads, targetserver, 0);
		await ns.sleep(weakentime);

		ns.run('/helpers/growstock.js', growthreads, targetserver, 0);
		await ns.sleep(growtime);

		ns.run('/helpers/weaken2.js', weakenthreads, targetserver, 0);
		await ns.sleep(weakentime);

		ns.run('/helpers/hack.js', hackthreads, targetserver, 0);
		await ns.sleep(hacktime);
	}
}