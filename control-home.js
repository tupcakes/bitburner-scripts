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
	ns.enableLog('run');
	ns.clearLog();

	const runon = ns.getHostname();

	// late game multipliers
	// let weakenmultiplier = .1;
	// let growmultiplier = 1;
	// let moneymultiplier = .3;

	// early game multipliers
	let weakenmultiplier = .3;
	let growmultiplier = .7;
	let moneymultiplier = .1;
	
	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;

	let controlscriptram = Math.trunc(ns.getScriptRam('control-home.js') + ns.getScriptRam('weaken.js') + ns.getScriptRam('grow.js'));
	let controlmaxRam = ns.getServerMaxRam(ns.getHostname()) - 10;
	let controlmaxnumthreads = Math.trunc(controlmaxRam / controlscriptram);
	let hackthreads = Math.trunc(ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) * moneymultiplier)));
	let weakenthreads = Math.trunc(controlmaxnumthreads * weakenmultiplier);
	let growthreads = Math.trunc(controlmaxnumthreads * growmultiplier);
	
	// ns.tprint("ServerMaxMoney: " + dollarUS.format(ns.getServerMaxMoney(target)));
	// ns.tprint("MoneytoHack: " + dollarUS.format((ns.getServerMaxMoney(target) * moneymultiplier)));
	// ns.tprint("controlmaxnumthreads: " + controlmaxnumthreads);
	// ns.tprint("controlscriptram: " + controlscriptram);
	// ns.tprint("controlmaxRam: " + controlmaxRam);
	// ns.tprint("weakenthreads: " + weakenthreads);
	// ns.tprint("growthreads: " + growthreads);
	

	// hackthreads returned a value less than 1
	if (hackthreads == -1) {
		hackthreads = 1;
		//ns.tprint("hackthreads: " + hackthreads);
	} else if (hackthreads == 0) {
		ns.tprint("hackthreads: 0");
		ns.tprint("No money?!?!?! EXITING!!!");
		ns.scriptkill('control-home.js', runon);
	} else {
		//ns.tprint("hackthreads: " + hackthreads);
	}


	while (true) {
		if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
			await ns.sleep(weakentime);
			hacktime = ns.getHackTime(target) + sleepoffset;
			ns.print("");
			ns.print("Running hack for " + hacktime + " ms");
			ns.print("hackthreads: " + hackthreads);
			ns.run("hack.js", hackthreads, target, hacktime);
			await ns.sleep(hacktime);
		} else {
			ns.print("");
			ns.print("First weaken. Run in: " + Math.trunc(hacktime) + " ms");
			weakentime = ns.getWeakenTime(target) + sleepoffset;
			ns.exec('weaken.js', runon, weakenthreads, target, hacktime);
			await ns.sleep(hacktime);

			ns.print("");
			ns.print("Grow. Run in: " + Math.trunc(weakentime) + " ms on");
			growtime = ns.getGrowTime(target) + sleepoffset;
			ns.exec('grow.js', runon, growthreads, target, weakentime);
			await ns.sleep(weakentime);

			ns.print("");
			ns.print("Second weaken. Run in: " + Math.trunc(growtime) + " ms");
			weakentime = ns.getWeakenTime(target) + sleepoffset;
			ns.exec('weaken.js', runon, weakenthreads, target, growtime);
			await ns.sleep(growtime);
		}
		ns.print("");
		ns.print("-----");
		ns.print("Money available: " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("Max money: " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Current security: " + ns.getServerSecurityLevel(target));
		ns.print("Min security: " + ns.getServerMinSecurityLevel(target));

		await ns.sleep(1000);
	}
}