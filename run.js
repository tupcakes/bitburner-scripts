export function autocomplete(data, args) {
	return data.servers;
}

/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0];

	ns.disableLog('ALL');
	//ns.killall();

	let ServerMoneyAvailable = ns.getServerMoneyAvailable(target);
	let ServerMaxMoney = ns.getServerMaxMoney(target);
	let ServerMinSecurityLevel = ns.getServerMinSecurityLevel(target);
	let ServerSecurityLevel = ns.getServerSecurityLevel(target);


	// determine thread counts
	//let hackamount = Math.trunc(ServerMoneyAvailable * .75);
	//let hackthreads = ns.hackAnalyzeThreads(target, hackamount);
	let weakenthreads = 1000;
	let hackamount = Math.trunc(ServerMaxMoney * .75);


	ns.print("target:" + target);
	ns.print("ServerMaxMoney:" + ServerMaxMoney);
	ns.print("ServerMoneyAvailable:" + ServerMoneyAvailable);
	ns.print("weakenthreads: " + weakenthreads);
	ns.print("ServerMinSecurityLevel: " + ServerMinSecurityLevel);
	ns.print("ServerSecurityLevel: " + ServerSecurityLevel);


	let sleepoffset = 1000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;
	// loop start
	while (true) {
		// determine grow threads required
		let growthreads = parseInt(ns.growthAnalyze(target, 10));
		// calc weaken threads based on growthreads
		weakenthreads = growthreads * 1.25;
		// get predicted weaken time
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.run("weaken.js", weakenthreads, target, hacktime);
		await ns.sleep(hacktime);

		// get predicted grow time
		// run grow with sleep of predicted weaken time with offset
		growtime = ns.getGrowTime(target) + sleepoffset;
		ns.run("grow.js", growthreads, target, weakentime);
		await ns.sleep(weakentime);

		// get predicted weaken time
		// run weaken with sleep of predicted grow time with offset
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.run("weaken.js", weakenthreads, target, growtime);
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
			// get hack threads to use
			let hackthreads = ns.hackAnalyzeThreads(target, hackamount);

			ns.print("");
			ns.print("Hacking: " + target);
			ns.print("Money: " + ns.getServerMoneyAvailable(target));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));
			ns.print("Threads: " + hackthreads);

			ns.run("hack.js", hackthreads, target, weakentime);
			await ns.sleep(weakentime);
		}

		await ns.sleep(1000);
	}



	// it should never get here
	ns.print("Script done");
}