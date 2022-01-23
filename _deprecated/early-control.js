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

	// get all attackingservers
	let attackingserver = 'home';


	// multipliers
	let weakenmultiplier = .2;
	let growmultiplier = 1.15;


	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;

	let weakenscriptram = ns.getScriptRam('weaken1.js') + ns.getScriptRam('weaken2.js');
	let growscriptram = ns.getScriptRam('grow.js');
	let hackscriptram = ns.getScriptRam('hack.js');
	let attackingserverscriptram = weakenscriptram + growscriptram + hackscriptram;

	let firstweakenrunning = false;
	let growrunning = false;
	let secondweakenrunning = false;
	let hackrunning = false;
	let firstweakenpid = 0;
	let growpid = 0;
	let secondweakenpid = 0;
	let hackpid = 0;
	let firststloop = true;
	let attackingserverfreeram = 0;
	let firstweakenrunningon = "";
	let growrunningon = "";
	let secondweakenrunningon = "";


	while (true) {
		await ns.sleep(20);

		if (firststloop == false) {
			hacktime = ns.getHackTime(target) + sleepoffset;
		}

		let ServerFreeRam = parseInt(ns.getServerMaxRam(attackingserver) - ns.getServerUsedRam(attackingserver));
		let ramforbatches = (ServerFreeRam - 10);
		let hackthreads = parseInt((ramforbatches) / hackscriptram);
		let moneyperhack = (ns.getServerMaxMoney(target) * ns.hackAnalyze(target)) * hackthreads;


		ns.clearLog();
		ns.print("ServerMoneyAvailable:   " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("ServerMaxMoney:         " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Money per hack cycle:   " + dollarUS.format(moneyperhack));
		ns.print("ServerSecurityLevel:    " + ns.getServerSecurityLevel(target));
		ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
		ns.print("Running first weaken:   " + firstweakenrunning + " " + firstweakenrunningon);
		ns.print("Running grow:           " + growrunning + " " + growrunningon);
		ns.print("Running second weaken:  " + secondweakenrunning + " " + secondweakenrunningon);
		ns.print("Hack threads:           " + hackthreads);
		// visual test to see if it's still looping
		ns.print(Math.floor(Math.random() * 1000));


		// if ready to hack, hack
		if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
			attackingserverfreeram = ns.getServerMaxRam(attackingserver) - ns.getServerUsedRam(attackingserver);

			if (attackingserverfreeram > attackingserverscriptram) {
				hacktime = ns.getHackTime(target) + sleepoffset;
				ns.clearLog();
				ns.print("------HACK RUNNING------");
				ns.print("Running hack for        " + hacktime + " ms");
				ns.print("hackthreads:            " + hackthreads);
				ns.print("Hack running on:        " + attackingserver);
				ns.print("Current security:       " + ns.getServerSecurityLevel(target));
				ns.print("Money available:        " + dollarUS.format(ns.getServerMoneyAvailable(target)));

				hackpid = ns.exec("hack.js", attackingserver, hackthreads, target, 0);
				hackrunning = ns.isRunning(hackpid);
				if (hackrunning == true) {
					await ns.sleep(hacktime);
				}
			} else {
				ns.print("Couldn't hack on " + attackingserver);
				await ns.sleep(1000);
				continue;
			}
		} else {
			// set the threads
			let attackingservermaxRam = ns.getServerMaxRam(attackingserver) - 10;
			let attackingservermaxnumthreads = Math.trunc(attackingservermaxRam / attackingserverscriptram);
			let weakenthreads = Math.trunc(attackingservermaxnumthreads * weakenmultiplier);
			let growthreads = Math.trunc(attackingservermaxnumthreads * growmultiplier);

			// check if scripts are already running
			firstweakenrunning = ns.isRunning(firstweakenpid);
			growrunning = ns.isRunning(growpid);
			secondweakenrunning = ns.isRunning(secondweakenpid);

			let attackingserverfreeram = ns.getServerMaxRam(attackingserver) - ns.getServerUsedRam(attackingserver);
			if (attackingserverfreeram > attackingserverscriptram && firstweakenrunning == false && growrunning == false && secondweakenrunning == false) {
				firstweakenrunningon = attackingserver;
				weakentime = ns.getWeakenTime(target) + sleepoffset;
				firstweakenpid = ns.exec('weaken1.js', attackingserver, weakenthreads, target, hacktime);
			} else {
				continue;
			}

			firstweakenrunning = ns.isRunning(firstweakenpid);
			growrunning = ns.isRunning(growpid);
			secondweakenrunning = ns.isRunning(secondweakenpid);

			attackingserverfreeram = ns.getServerMaxRam(attackingserver) - ns.getServerUsedRam(attackingserver);
			if (attackingserverfreeram > attackingserverscriptram && firstweakenrunning == true && growrunning == false && secondweakenrunning == false) {
				growrunningon = attackingserver;
				growtime = ns.getGrowTime(target) + sleepoffset;
				growpid = ns.exec('grow.js', attackingserver, growthreads, target, (weakentime + hacktime));
			} else {
				continue;
			}

			firstweakenrunning = ns.isRunning(firstweakenpid);
			growrunning = ns.isRunning(growpid);
			secondweakenrunning = ns.isRunning(secondweakenpid);

			attackingserverfreeram = ns.getServerMaxRam(attackingserver) - ns.getServerUsedRam(attackingserver);
			if (attackingserverfreeram > attackingserverscriptram && firstweakenrunning == true && growrunning == true && secondweakenrunning == false) {
				secondweakenrunningon = attackingserver;
				weakentime = ns.getWeakenTime(target) + sleepoffset;
				secondweakenpid = ns.exec('weaken2.js', attackingserver, weakenthreads, target, (weakentime + hacktime + growtime));
			} else {
				continue;
			}

			firststloop = false;

			if (firstweakenrunning == false && growrunning == false && secondweakenrunning == false) {
				continue;
			}
		}
	}
	ns.tprint("Script finished. This shouldnt happen.");
}