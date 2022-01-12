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
	ns.enableLog('exec');
	ns.clearLog();

	// get all pservs
	let pserv = ns.getPurchasedServers();
	//pserv = pserv.push('home')

	// late game multipliers
	// let weakenmultiplier = .1;
	// let growmultiplier = 1;
	// let moneymultiplier = .3;

	// early game multipliers
	let weakenmultiplier = .3;
	let growmultiplier = 1;
	let moneymultiplier = .1;

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
	let firstweakenpid = 0;
	let growpid = 0;
	let secondweakenpid = 0;
	let firststloop = true;


	while (true) {
		await ns.sleep(500);
		if (firststloop == false) {
			hacktime = ns.getHackTime(target) + sleepoffset;
		}

		// check if scripts are already running
		firstweakenrunning = ns.isRunning(firstweakenpid);
		ns.print("firstweakenrunning: " + firstweakenrunning);
		growrunning = ns.isRunning(growpid);
		ns.print("growrunning: " + growrunning);
		secondweakenrunning = ns.isRunning(secondweakenpid);
		ns.print("secondweakenrunning: " + secondweakenrunning);

		if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
			hackloop: for (let i = 0; i < pserv.length; ++i) {
				await ns.sleep(500);
				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);

				if (pservfreeram > pservscriptram) {
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
			preploop: for (let i = 0; i < pserv.length; ++i) {
				await ns.sleep(500);

				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				ns.print("getting here--" + pservfreeram + "--" + pservscriptram + "--" + firstweakenrunning);
				if (pservfreeram > pservscriptram && (firstweakenrunning == false && growrunning == false && secondweakenrunning == false)) {
					ns.print("");
					ns.print("First weaken. Run in: " + Math.trunc(hacktime) + " ms");
					ns.print("First weaken running on: " + pserv[i]);
					weakentime = ns.getWeakenTime(target) + sleepoffset;
					firstweakenpid = ns.exec('weaken1.js', pserv[i], weakenthreads, target, hacktime);
				} else {
					continue preploop;
				}

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && (growrunning == false && secondweakenrunning == false)) {
					ns.print("");
					ns.print("Grow. Run in: " + Math.trunc(weakentime + hacktime) + " ms on");
					ns.print("Grow running on: " + pserv[i]);
					growtime = ns.getGrowTime(target) + sleepoffset;
					growpid = ns.exec('grow.js', pserv[i], growthreads, target, (weakentime + hacktime));
				} else {
					continue preploop;
				}

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && secondweakenrunning == false) {
					ns.print("");
					ns.print("Second weaken. Run in: " + Math.trunc(weakentime + hacktime + growtime) + " ms");
					ns.print("Second weaken running on: " + pserv[i]);
					weakentime = ns.getWeakenTime(target) + sleepoffset;
					secondweakenpid = ns.exec('weaken2.js', pserv[i], weakenthreads, target, (weakentime + hacktime + growtime));
					await ns.sleep(weakentime + hacktime + growtime);
				} else {
					continue preploop;
				}
				firststloop = false;
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