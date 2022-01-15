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
	//ns.enableLog('exec');
	ns.clearLog();

	// get all pservs
	let pserv = ns.getPurchasedServers();
	pserv.push("home");

	// early game multipliers
	let weakenmultiplier = .2;
	let growmultiplier = 1.15;
	let moneymultiplier = .20;

	// aggressive mode multipliers
	let aggressiveweakenmultiplier = .4;
	let aggressivegrowmultiplier = 2;

	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;

	let weakenscriptram = ns.getScriptRam('weaken1.js') + ns.getScriptRam('weaken2.js');
	let growscriptram = ns.getScriptRam('grow.js');
	let hackscriptram = ns.getScriptRam('hack.js');
	let pservscriptram = weakenscriptram + growscriptram + hackscriptram;

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
	let firstweakenrunningon = "";
	let growrunningon = "";
	let secondweakenrunningon = "";


	while (true) {
		await ns.sleep(20);

		if (firststloop == false) {
			hacktime = ns.getHackTime(target) + sleepoffset;
		}

		let hackthreads = Math.max(1, ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) * moneymultiplier)));
		// hackthreads returned a value less than 1no
		if (target == 'n00dles') {
			hackthreads = Math.max(1, ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) - 70000)));
		}
		let moneyperhack = (ns.getServerMaxMoney(target) * ns.hackAnalyze(target)) * hackthreads;

		ns.clearLog();
		ns.print("ServerMoneyAvailable:   " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("ServerMaxMoney:         " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Money per hack cycle:   " + dollarUS.format(moneyperhack));
		ns.print("ServerSecurityLevel:    " + ns.getServerSecurityLevel(target));
		ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
		ns.print("pserv length:           " + pserv.length);
		ns.print("Running first weaken:   " + firstweakenrunning + " " + firstweakenrunningon);
		ns.print("Running grow:           " + growrunning + " " + growrunningon);
		ns.print("Running second weaken:  " + secondweakenrunning + " " + secondweakenrunningon);
		ns.print("Hack threads:           " + hackthreads);
		// visual test to see if it's still looping
		ns.print(Math.floor(Math.random() * 1000));


		if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
			hackloop: for (let j = 0; j < pserv.length; ++j) {
				await ns.sleep(20);
				pservfreeram = ns.getServerMaxRam(pserv[j]) - ns.getServerUsedRam(pserv[j]);

				// ns.print("");
				// ns.print("I'M THE HACKLOOP");

				if (pservfreeram > pservscriptram) {
					hacktime = ns.getHackTime(target) + sleepoffset;
					ns.clearLog();
					ns.print("------HACK RUNNING------");
					ns.print("Running hack for        " + hacktime + " ms");
					ns.print("hackthreads:            " + hackthreads);
					ns.print("Hack running on:        " + pserv[j]);
					ns.print("Current security:       " + ns.getServerSecurityLevel(target));
					ns.print("Money available:        " + dollarUS.format(ns.getServerMoneyAvailable(target)));

					hackpid = ns.exec("hack.js", pserv[j], hackthreads, target, 0);
					hackrunning = ns.isRunning(hackpid);
					if (hackrunning == true) {
						await ns.sleep(hacktime);
						break hackloop;
					}
				} else {
					ns.print("Couldn't hack on " + pserv[j]);
					continue hackloop;
				}
			}
		} else {
			preploop: for (let i = 0; i < pserv.length; i++) {
				await ns.sleep(20);

				// ns.print("");
				// ns.print("I'M THE PREPLOOP");

				// set the threads
				let pservmaxRam = ns.getServerMaxRam(pserv[i]) - 10;
				let pservmaxnumthreads = Math.trunc(pservmaxRam / pservscriptram);
				let weakenthreads = Math.trunc(pservmaxnumthreads * weakenmultiplier);
				let growthreads = Math.trunc(pservmaxnumthreads * growmultiplier);

				// check if scripts are already running
				firstweakenrunning = ns.isRunning(firstweakenpid);
				growrunning = ns.isRunning(growpid);
				secondweakenrunning = ns.isRunning(secondweakenpid);

				let pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && firstweakenrunning == false && growrunning == false && secondweakenrunning == false) {
					firstweakenrunningon = pserv[i];
					weakentime = ns.getWeakenTime(target) + sleepoffset;
					firstweakenpid = ns.exec('weaken1.js', pserv[i], weakenthreads, target, hacktime);
				} else {
					continue preploop;
				}

				firstweakenrunning = ns.isRunning(firstweakenpid);
				growrunning = ns.isRunning(growpid);
				secondweakenrunning = ns.isRunning(secondweakenpid);

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && firstweakenrunning == true && growrunning == false && secondweakenrunning == false) {
					growrunningon = pserv[i];
					growtime = ns.getGrowTime(target) + sleepoffset;
					growpid = ns.exec('grow.js', pserv[i], growthreads, target, (weakentime + hacktime));
				} else {
					continue preploop;
				}

				firstweakenrunning = ns.isRunning(firstweakenpid);
				growrunning = ns.isRunning(growpid);
				secondweakenrunning = ns.isRunning(secondweakenpid);

				pservfreeram = ns.getServerMaxRam(pserv[i]) - ns.getServerUsedRam(pserv[i]);
				if (pservfreeram > pservscriptram && firstweakenrunning == true && growrunning == true && secondweakenrunning == false) {
					secondweakenrunningon = pserv[i];
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
		pserv.push("home");
	}
	ns.tprint("Script finished. This shouldnt happen.");
}