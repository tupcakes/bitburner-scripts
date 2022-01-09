/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let target = ns.args[0];
	let ownedserver = ns.getHostname();
	
	let batchram = ns.getScriptRam('weaken.js') + ns.getScriptRam('grow.js')
	let ServerFreeRam = parseInt(ns.getServerMaxRam(ownedserver) - ns.getServerUsedRam(ownedserver));
	let ramforbatches = (ServerFreeRam - 10);
	let threads = parseInt((ramforbatches) / batchram);

	ns.print("ownedserver: " + ownedserver);
	ns.print("ServerFreeRam: " + ServerFreeRam);
	ns.print("ramforbatches: " + ramforbatches);
	ns.print("threads: " + threads);


	let sleepoffset = 1000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;
	// loop start
	while (true) {
		// run first weaken if needed
		if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
			ns.print("");
			ns.print("First weaken. Run in: " + Math.trunc(hacktime) + " ms");
			// get predicted weaken time
			weakentime = ns.getWeakenTime(target) + sleepoffset;
			ns.exec("weaken.js", ownedserver, threads, target, hacktime);
			await ns.sleep(hacktime);
		}

		ns.print("");
		ns.print("Grow. Run in: " + Math.trunc(weakentime) + " ms");
		// get predicted grow time
		// run grow with sleep of predicted weaken time with offset
		growtime = ns.getGrowTime(target) + sleepoffset;
		ns.exec("grow.js", ownedserver, threads, target, weakentime);
		await ns.sleep(weakentime);

		ns.print("");
		ns.print("Second weaken. Run in: " + Math.trunc(growtime) + " ms");
		// get predicted weaken time
		// run weaken with sleep of predicted grow time with offset
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.exec("weaken.js", ownedserver, threads, target, growtime);
		await ns.sleep(growtime);

		// get predicted hack time
		// run hack with sleep of predicted weaken time with offset
		if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
			//hacktime = ns.getHackTime(target) + sleepoffset;
			ns.print("");
			ns.print("Money: " + ns.getServerMoneyAvailable(target));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));
			ns.print("Target money not ready...LOOPING");
			continue;
		} else if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
			//hacktime = ns.getHackTime(target) + sleepoffset;
			ns.print("");
			ns.print("Money: " + ns.getServerMoneyAvailable(target));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));
			ns.print("Target security not ready...LOOPING");
			continue;
		} else {
			hacktime = ns.getHackTime(target) + sleepoffset;

			ns.print("");
			ns.print("Hacking: " + target);
			ns.print("Run in: " + Math.trunc(weakentime) + " ms");
			ns.print("Money: " + ns.getServerMoneyAvailable(target));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));

			ns.exec("hack.js", ownedserver, threads, target, weakentime);
			await ns.sleep(weakentime);
		}

		await ns.sleep(1000);
	}
}