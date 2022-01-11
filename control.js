export function autocomplete(data, args) {
	return data.servers;
}

/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0];

	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	ns.disableLog('ALL');
	ns.enableLog('run');
	ns.clearLog();

	// get all pservs
	let pserv = ns.getPurchasedServers();

	let weakenmultiplier = .25;
	let growmultiplier = .75;
	let moneymultiplier = .25;
	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;


	let hackthreads = Math.trunc(ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) * moneymultiplier)));
	// if there wasn't enough ram to calc hackthreads, wait and recalc
	while (hackthreads == -1) {
		await ns.sleep(500);
		ns.tprint("Not enough ram for hackthreads: " + hackthreads);
		hackthreads = Math.trunc(ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) * moneymultiplier)));
	}
	ns.tprint("hackthreads: " + hackthreads);


	let pservscrptram = ns.getScriptRam('weaken.js') + ns.getScriptRam('grow.js');
	let pservmaxRam = ns.getServerMaxRam(pserv[0]) - 10;
	let pservmaxnumthreads = Math.trunc(pservmaxRam / pservscrptram);
	let weakenthreads = Math.trunc(pservmaxnumthreads * weakenmultiplier);
	let growthreads = Math.trunc(pservmaxnumthreads * growmultiplier);

	while (true) {
		if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
			await ns.sleep(weakentime);
			hacktime = ns.getHackTime(target) + sleepoffset;
			ns.print("");
			ns.print("Running hack for " + hacktime + " ms");
			ns.print("hackthreads: " + hackthreads);
			ns.run("hack.js", hackthreads, target, 0);
			await ns.sleep(hacktime);
		} else {
			for (let i = 0; i < pserv.length; ++i) {
				ns.exec('weaken.js', pserv[i], weakenthreads, target, 0);

				ns.exec('grow.js', pserv[i], growthreads, target, 0);

				weakentime = ns.getWeakenTime(target) + sleepoffset;
				ns.exec('weaken.js', pserv[i], weakenthreads, target, 0);
				await ns.sleep(500);
			}
		}
		ns.print("");
		ns.print("-----");
		ns.print("Money available: " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("Max money: " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Current security: " + ns.getServerSecurityLevel(target));
		ns.print("Min security: " + ns.getServerMinSecurityLevel(target));

		await ns.sleep(1000);
	}
}