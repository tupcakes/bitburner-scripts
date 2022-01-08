/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let target = "joesguns";
	let ownedserver = "home";


	let scriptram = ns.getScriptRam("/earlygame/early-run.js");
	let operationscriptsram = ns.getScriptRam("hack.js") + ns.getScriptRam("weaken.js") + ns.getScriptRam("grow.js");
	let maxRam = ns.getServerMaxRam(ownedserver) - 5;
	let maxnumthreads = parseInt(maxRam / 3);
	let threads = maxnumthreads / 2; // only two operation scripts should be running at a time

	let ServerMoneyAvailable = ns.getServerMoneyAvailable(target);
	let ServerMaxMoney = ns.getServerMaxMoney(target);
	let ServerMinSecurityLevel = ns.getServerMinSecurityLevel(target);
	let ServerSecurityLevel = ns.getServerSecurityLevel(target);

	let hackamount = Math.trunc(ServerMaxMoney * .75);


	ns.tprint("scriptram: " + scriptram);
	ns.tprint("operationscriptsram: " + operationscriptsram);
	ns.tprint("maxRam: " + maxRam);
	ns.tprint("threads: " + threads);


	let sleepoffset = 1000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;
	// loop start
	while (true) {
		// get predicted weaken time
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.run("weaken.js", threads, target, hacktime);
		await ns.sleep(hacktime);

		// get predicted grow time
		// run grow with sleep of predicted weaken time with offset
		growtime = ns.getGrowTime(target) + sleepoffset;
		ns.run("grow.js", threads, target, weakentime);
		await ns.sleep(weakentime);

		// get predicted weaken time
		// run weaken with sleep of predicted grow time with offset
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.run("weaken.js", threads, target, growtime);
		await ns.sleep(growtime);

		// get predicted hack time
		// run hack with sleep of predicted weaken time with offset
		if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
			hacktime = ns.getHackTime(target) + sleepoffset;
			ns.print("");
			ns.print("Money: " + ns.getServerMoneyAvailable(target));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));
			ns.print("Target money not ready...LOOPING");
			continue;
		} else if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
			hacktime = ns.getHackTime(target) + sleepoffset;
			ns.print("");
			ns.print("Money: " + ns.getServerMoneyAvailable(target));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));
			ns.print("Target security not ready...LOOPING");
			continue;
		} else {
			hacktime = ns.getHackTime(target) + sleepoffset;

			ns.print("");
			ns.print("Hacking: " + target);
			ns.print("Money: " + ns.getServerMoneyAvailable(target));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));
			ns.print("Threads: " + hackthreads);

			ns.run("hack.js", threads, target, weakentime);
			await ns.sleep(weakentime);
		}

		await ns.sleep(1000);
	}
}