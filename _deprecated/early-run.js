export function autocomplete(data, args) {
	return data.servers;
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	let target = ns.args[0];
	let ownedserver = ns.getHostname();

	let batchram = ns.getScriptRam('weaken.js') + ns.getScriptRam('grow.js');
	let hackram = ns.getScriptRam('hack.js');
	let ServerFreeRam = parseInt(ns.getServerMaxRam(ownedserver) - ns.getServerUsedRam(ownedserver));
	let ramforbatches = (ServerFreeRam - 10);
	let threads = parseInt((ramforbatches) / batchram);

	let weakenmultiplier = .5;
	let growmultiplier = .5;


	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;

	let firststloop = true;

	let weakenthreads = Math.trunc(threads * weakenmultiplier);
	let growthreads = Math.trunc(threads * growmultiplier);


	// loop start
	while (true) {
		if (firststloop == false) {
			hacktime = ns.getHackTime(target) + sleepoffset;
		}

		let hackthreads = parseInt((ramforbatches) / hackram);
		let moneyperhack = (ns.getServerMaxMoney(target) * ns.hackAnalyze(target)) * hackthreads;

		ns.clearLog();
		ns.print("ServerMoneyAvailable:   " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("ServerMaxMoney:         " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Money per hack cycle:   " + dollarUS.format(moneyperhack));
		ns.print("ServerSecurityLevel:    " + ns.getServerSecurityLevel(target));
		ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
		// ns.print("Running first weaken:   " + firstweakenrunning);
		// ns.print("Running grow:           " + growrunning);
		// ns.print("Running second weaken:  " + secondweakenrunning);
		ns.print("Hack threads:           " + hackthreads);
		// visual test to see if it's still looping
		ns.print(Math.floor(Math.random() * 1000));


		// get predicted weaken time
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.exec("weaken.js", ownedserver, weakenthreads, target, hacktime);
		await ns.sleep(hacktime);

		// get predicted grow time
		// run grow with sleep of predicted weaken time with offset
		growtime = ns.getGrowTime(target) + sleepoffset;
		ns.exec("grow.js", ownedserver, growthreads, target, weakentime);
		await ns.sleep(weakentime);

		// get predicted weaken time
		// run weaken with sleep of predicted grow time with offset
		weakentime = ns.getWeakenTime(target) + sleepoffset;
		ns.exec("weaken.js", ownedserver, weakenthreads, target, growtime);
		await ns.sleep(growtime);

		// get predicted hack time
		// run hack with sleep of predicted weaken time with offset
		if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
			firststloop = false;
			continue;
		} else if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
			firststloop = false;
			continue;
		} else {
			let servermoneyavailable = ns.getServerMoneyAvailable(target);

			ns.print("");
			ns.print("Hacking: " + target);
			ns.print("Run in: " + Math.trunc(weakentime) + " ms");
			ns.print("Money: " + dollarUS.format(servermoneyavailable));
			ns.print("Sec Level: " + ns.getServerSecurityLevel(target));
			let returnmoney = dollarUS.format(((ns.hackAnalyze(target) * servermoneyavailable) * hackthreads));
			ns.print("Return: " + returnmoney);

			// run with half threads to decrease time to get back to max -- TESTING
			ns.exec("hack.js", ownedserver, hackthreads, target, weakentime);
			await ns.sleep(weakentime);
			firststloop = false;
		}

		await ns.sleep(1000);
	}
}