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
	// hackthreads returned a value less than 1
	if (hackthreads == -1) {
		hackthreads = 1;
	}

	let weakenscriptram = ns.getScriptRam('weaken.js');
	let growscriptram = ns.getScriptRam('grow.js');
	let hackscriptram = ns.getScriptRam('hack.js');
	let pservscriptram = weakenscriptram + growscriptram + hackscriptram;
	let pservmaxRam = ns.getServerMaxRam(pserv[0]) - 10;
	let pservmaxnumthreads = Math.trunc(pservmaxRam / pservscriptram);
	let weakenthreads = Math.trunc(pservmaxnumthreads * weakenmultiplier);
	let growthreads = Math.trunc(pservmaxnumthreads * growmultiplier);

	while (true) {
		let firstweakenrunning = false;
		let growrunning = false;
		let secondweakenrunning = false;

		if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
			for (let i = 0; i < pserv.length; ++i) {
				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);

				if (pservfreeram > pservscriptram) {
					await ns.sleep(weakentime);
					hacktime = ns.getHackTime(target) + sleepoffset;
					ns.print("");
					ns.print("Running hack for " + hacktime + " ms");
					ns.print("hackthreads: " + hackthreads);
					ns.print("Hack running on: " + pserv[i]);
					ns.print("Current security: " + ns.getServerSecurityLevel(target));
					ns.print("Money available: " + dollarUS.format(ns.getServerMoneyAvailable(target)));
					ns.exec("hack.js", pserv[i], hackthreads, target, 0);
					await ns.sleep(hacktime);
				} else {
					continue;
				}
			}
		} else {
			for (let i = 0; i < pserv.length; ++i) {
				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);

				if (pservfreeram > pservscriptram && firstweakenrunning == false) {
					ns.print("");
					ns.print("First weaken. Run in: " + Math.trunc(hacktime) + " ms");
					ns.print("First weaken running on: " + pserv[i]);
					weakentime = ns.getWeakenTime(target) + sleepoffset;
					ns.exec('weaken.js', pserv[i], weakenthreads, target, hacktime);
					firstweakenrunning = true;
					//await ns.sleep(hacktime);
				} else {
					continue;
				}

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && growrunning == false) {
					ns.print("");
					ns.print("Grow. Run in: " + Math.trunc(weakentime) + " ms on");
					ns.print("Grow running on: " + pserv[i]);
					growtime = ns.getGrowTime(target) + sleepoffset;
					ns.exec('grow.js', pserv[i], growthreads, target, weakentime);
					growrunning = true;
					//await ns.sleep(weakentime);
				} else {
					continue;
				}

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && secondweakenrunning == false) {
					ns.print("");
					ns.print("Second weaken. Run in: " + Math.trunc(growtime) + " ms");
					ns.print("Second weaken running on: " + pserv[i]);
					weakentime = ns.getWeakenTime(target) + sleepoffset;
					ns.exec('weaken.js', pserv[i], weakenthreads, target, growtime);
					let secondweakenrunning = true;
					//await ns.sleep(growtime);
				} else {
					continue;
				}
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
