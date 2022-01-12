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
	//pserv = pserv.push('home')

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
	let firstweakenrunning = false;
	let growrunning = false;
	let secondweakenrunning = false;


	while (true) {
		await ns.sleep(500);
		firstweakenrunning = false;
		growrunning = false;
		secondweakenrunning = false;

		if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
			hackloop: for (let i = 0; i < pserv.length; i++) {
				await ns.sleep(500);
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
					break hackloop;
				}
			}
		} else {
			preploop: for (let i = 0; i < pserv.length; i++) {
				await ns.sleep(500);
				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);

				if (pservfreeram > pservscriptram && firstweakenrunning == false) {
					ns.print("");
					ns.print("First weaken. Run in: " + Math.trunc(hacktime) + " ms");
					ns.print("First weaken running on: " + pserv[i]);
					weakentime = ns.getWeakenTime(target) + sleepoffset;
					ns.exec('weaken.js', pserv[i], weakenthreads, target, hacktime);
					firstweakenrunning = true;
				} else {
					continue preploop;
				}

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && growrunning == false) {
					ns.print("");
					ns.print("Grow. Run in: " + Math.trunc(weakentime) + " ms on");
					ns.print("Grow running on: " + pserv[i]);
					growtime = ns.getGrowTime(target) + sleepoffset;
					ns.exec('grow.js', pserv[i], growthreads, target, weakentime);
					growrunning = true;
				} else {
					continue preploop;
				}

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && secondweakenrunning == false) {
					ns.print("");
					ns.print("Second weaken. Run in: " + Math.trunc(growtime) + " ms");
					ns.print("Second weaken running on: " + pserv[i]);
					weakentime = ns.getWeakenTime(target) + sleepoffset;
					ns.exec('weaken.js', pserv[i], weakenthreads, target, growtime);
					let secondweakenrunning = true;
				} else {
					continue preploop;
				}
				break preploop;
			}
		}
		ns.print("");
		ns.print("-----");
		ns.print("Money available: " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("Max money: " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Current security: " + ns.getServerSecurityLevel(target));
		ns.print("Min security: " + ns.getServerMinSecurityLevel(target));
	}
	ns.tprint("Script finished. This shouldnt happen.");
}