/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let target = ns.args[0];
	let ownedserver = ns.getHostname();


	await ns.scp("/earlygame/early-run.js", ownedserver);
	await ns.scp("hack.js", ownedserver);
	await ns.scp("grow.js", ownedserver);
	await ns.scp("weaken.js", ownedserver);
	

	let scriptram = ns.getScriptRam("/earlygame/early-run.js");
	let operationscriptsram = ns.getScriptRam("weaken.js") + ns.getScriptRam("grow.js");
	let maxRamforops = ns.getServerMaxRam(ownedserver) - scriptram - operationscriptsram - 10;
	let threads = parseInt(maxRamforops / 3);


	let ServerMoneyAvailable = ns.getServerMoneyAvailable(target);
	let ServerMaxMoney = ns.getServerMaxMoney(target);
	let ServerMinSecurityLevel = ns.getServerMinSecurityLevel(target);
	let ServerSecurityLevel = ns.getServerSecurityLevel(target);

	//let hackamount = Math.trunc(ServerMaxMoney * .75);


	ns.tprint("scriptram: " + scriptram);
	//ns.tprint("operationscriptsram: " + operationscriptsram);
	ns.tprint("maxRamforops: " + maxRamforops);
	ns.tprint("threads: " + threads);
	ns.tprint("weakenram: " + ns.getScriptRam("weaken.js") * threads);
	ns.tprint("growram: " + ns.getScriptRam("grow.js") * threads);
	ns.tprint("hackram: " + ns.getScriptRam("hack.js") * threads);


	let sleepoffset = 1000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;
	// loop start
	while (true) {
		// get predicted weaken time
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.exec("weaken.js", ownedserver, threads, target, hacktime);
		await ns.sleep(hacktime);

		// get predicted grow time
		// run grow with sleep of predicted weaken time with offset
		growtime = ns.getGrowTime(target) + sleepoffset;
		ns.exec("grow.js", ownedserver, threads, target, weakentime);
		await ns.sleep(weakentime);

		// get predicted weaken time
		// run weaken with sleep of predicted grow time with offset
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.exec("weaken.js", ownedserver, threads, target, growtime);
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

			ns.exec("hack.js", ownedserver, threads, target, weakentime);
			await ns.sleep(weakentime);
		}

		await ns.sleep(1000);
	}
}