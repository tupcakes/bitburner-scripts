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
	pserv.push("home");


	// early game multipliers
	let weakenmultiplier = .3;
	let growmultiplier = 1;
	let moneymultiplier = .1;

	// late game multipliers
	// let weakenmultiplier = .1;
	// let growmultiplier = 1;
	// let moneymultiplier = .3;

	// agressive grow multipliers
	let aggressiveweakenmultiplier = .5;
	let aggressivegrowmultiplier = 2;


	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;


	let hackthreads = Math.trunc(ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) * moneymultiplier)));
	// hackthreads returned a value less than 1
	if (hackthreads == -1) {
		hackthreads = 1;
	}

	let weakenscriptram = ns.getScriptRam('weaken1.js') + ns.getScriptRam('weaken2.js');
	let growscriptram = ns.getScriptRam('grow.js');
	let hackscriptram = ns.getScriptRam('hack.js');
	let pservscriptram = weakenscriptram + growscriptram + hackscriptram;
	let pservmaxRam = 0;

	if (ns.serverExists(pserv[0])) {
		pservmaxRam = ns.getServerMaxRam(pserv[0]) - 10;
	} else {
		ns.print("No pservs. Using home.")
		pservmaxRam = ns.getServerMaxRam('home') - 10;
	}

	let pservmaxnumthreads = Math.trunc(pservmaxRam / pservscriptram);
	let weakenthreads = Math.trunc(pservmaxnumthreads * weakenmultiplier);
	let growthreads = Math.trunc(pservmaxnumthreads * growmultiplier);
	let firstweakenrunning = false;
	let growrunning = false;
	let secondweakenrunning = false;
	let hackrunning = false;
	let firstweakenpid = 0;
	let growpid = 0;
	let secondweakenpid = 0;
	let hackpid = 0;
	let firststloop = true;
	let pservfreeram = 0;


	while (true) {
		await ns.sleep(500);

		// if money below maxmoney - amount to hack
		// use agressive grow and weaken multipliers
		// else
		// normal multipliers
		let moneyperhack = (ns.getServerMaxMoney(target) * ns.hackAnalyze(target)) * hackthreads;
		let aggressivegrowthreshold = ns.getServerMaxMoney(target) - moneyperhack;
		if (ns.getServerMoneyAvailable(target) < aggressivegrowthreshold) {
			ns.print("Money available too low for hack. Using aggressive multipliers.")
			let weakenthreads = Math.trunc(pservmaxnumthreads * aggressiveweakenmultiplier);
			let growthreads = Math.trunc(pservmaxnumthreads * aggressivegrowmultiplier);
		} else {
			ns.print("Money above threshold. Using normal multipliers.")
			weakenthreads = Math.trunc(pservmaxnumthreads * weakenmultiplier);
			growthreads = Math.trunc(pservmaxnumthreads * growmultiplier);
		}


		if (firststloop == false) {
			hacktime = ns.getHackTime(target) + sleepoffset;
		}

		ns.print("");
		ns.print("ServerMoneyAvailable: " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("ServerMaxMoney: " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("ServerSecurityLevel: " + ns.getServerSecurityLevel(target));
		ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
		ns.print("pserv length: " + pserv.length);


		//!!! bug - grow and second weaken timing off
		// if ready to hack run hack, else weak/grow/weak
		if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
			hackloop: for (let i = 0; i < pserv.length; ++i) {
				await ns.sleep(500);
				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);

				ns.print("I'M THE HACKLOOP");

				if (pservfreeram > pservscriptram) {
					hacktime = ns.getHackTime(target) + sleepoffset;
					ns.print("");
					ns.print("Running hack for " + hacktime + " ms");
					ns.print("hackthreads: " + hackthreads);
					ns.print("Hack running on: " + pserv[i]);
					ns.print("Current security: " + ns.getServerSecurityLevel(target));
					ns.print("Money available: " + dollarUS.format(ns.getServerMoneyAvailable(target)));

					hackpid = ns.exec("hack.js", pserv[i], hackthreads, target, 0);
					ns.print(hackpid);
					hackrunning = ns.isRunning(hackpid);
					if (hackrunning == true) {
						await ns.sleep(hacktime);
						break hackloop;
					}
				} else {
					ns.print("Couldn't hack on " + pserv[i]);
					continue hackloop;
				}

				ns.print("");
				ns.print("-----hackloop");
				ns.print("Money available: " + dollarUS.format(ns.getServerMoneyAvailable(target)));
				ns.print("Max money: " + dollarUS.format(ns.getServerMaxMoney(target)));
				ns.print("Current security: " + ns.getServerSecurityLevel(target));
				ns.print("Min security: " + ns.getServerMinSecurityLevel(target));
			}
		} else {
			preploop: for (let i = 0; i < pserv.length; ++i) {
				await ns.sleep(500);

				ns.print("I'M THE PREPLOOP");

				// check if scripts are already running
				firstweakenrunning = ns.isRunning(firstweakenpid);
				growrunning = ns.isRunning(growpid);
				secondweakenrunning = ns.isRunning(secondweakenpid);

				ns.print("         firstweaken   grow   secondweaken");
				ns.print("Running->" + firstweakenrunning + "         " + growrunning + "  " + secondweakenrunning);

				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
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
				} else {
					continue preploop;
				}

				firststloop = false;

				if (firstweakenrunning == false && growrunning == false && secondweakenrunning == false) {
					break preploop;
				}
			}
		}

		// check for more pservs
		pserv = ns.getPurchasedServers();

		//ns.print("Looping...")
	}
	ns.tprint("Script finished. This shouldnt happen.");
}