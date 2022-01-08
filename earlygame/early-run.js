/** @param {NS} ns **/
export async function main(ns) {
	//ns.disableLog('ALL');

	let target = ns.args[0];
	let ownedserver = ns.getHostname();
	ns.tprint("ownedserver: " + ownedserver);

	let ServerMaxRam = ns.getServerMaxRam(ownedserver);
	let ramforthreads = (ServerMaxRam - 10) / 3;
	let threads = Math.trunc(ramforthreads);

	ns.tprint("ramforthreads: " + ramforthreads);
	ns.tprint("ramperscript: " + Math.trunc((ramforthreads / 3)));
	ns.tprint("threads: " + threads);


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