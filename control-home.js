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

	const runon = "home";

	let weakenmultiplier = .25;
	let growmultiplier = .75;
	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;

	let controlscriptram = ns.getScriptRam('control-home.js') + ns.getScriptRam('weaken.js') + ns.getScriptRam('grow.js');
	let controlmaxRam = ns.getServerMaxRam(ns.getHostname()) - 10;
	let controlmaxnumthreads = Math.trunc(controlmaxRam / controlscriptram);
	let hackthreads = Math.trunc(ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) * .5)));
	let weakenthreads = Math.trunc(controlmaxnumthreads * weakenmultiplier);
	let growthreads = Math.trunc(controlmaxnumthreads * growmultiplier);

	while (true) {
		if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
			ns.print("");
			ns.print("Running hack");
			ns.print("hackthreads: " + hackthreads);
			ns.run("hack.js", hackthreads, target, 0);
			hacktime = ns.getHackTime(target) + sleepoffset;
			await ns.sleep(weakentime);
		} else {
			ns.print("");
			ns.print("First weaken. Run in: " + Math.trunc(hacktime) + " ms on " + pserv[i]);
			weakentime = ns.getWeakenTime(target) + sleepoffset;
			ns.exec('weaken.js', runon, weakenthreads, target, 0);
			await ns.sleep(hacktime);

			ns.print("");
			ns.print("Grow. Run in: " + Math.trunc(weakentime) + " ms on " + pserv[i]);
			growtime = ns.getGrowTime(target) + sleepoffset;
			ns.exec('grow.js', runon, growthreads, target, 0);
			await ns.sleep(weakentime);

			ns.print("");
			ns.print("Second weaken. Run in: " + Math.trunc(growtime) + " ms on " + pserv[i]);
			weakentime = ns.getWeakenTime(target) + sleepoffset;
			ns.exec('weaken.js', runon, weakenthreads, target, 0);
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