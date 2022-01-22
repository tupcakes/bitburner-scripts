/**
 * This is a early to mid level script. it will assign hack, weaken,
 * and grow jobs to rooted servers, then psers, then home.
 */


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

	let file = ns.read("server_list.txt");
	let rootableservers = file.split("\r\n");

	// multipliers - ADJUST THIS
	let weakendecrease = .6;
	let growthfactor = 1.06;
	let moneypercentage = .25;

	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;

	let weakenscriptram = ns.getScriptRam('weaken1.js');
	let growscriptram = ns.getScriptRam('grow.js');
	let hackscriptram = ns.getScriptRam('hack.js');

	let usableserversthreadsavailable = 0;

	let firstweakenrunning = false;
	let growrunning = false;
	let secondweakenrunning = false;
	let usableserversfreeram = 0;
	let pid = null;


	while (true) {
		await ns.sleep(20);

		// build list of usable servers
		let usableservers = [];

		let pservs = ns.getPurchasedServers();
		// add all rootable servers that have ram and we have root on
		for (const rootableserver of rootableservers) {
			if (ns.getServerMaxRam(rootableserver) > 0 && ns.hasRootAccess(rootableserver)) {
				usableservers.push(rootableserver);
			}
		}
		for (const pserv of pservs) {
			usableservers.push(pserv);
		}
		usableservers.push("home");


		let returnmoney = ns.getServerMaxMoney(target) * moneypercentage;
		let reqhackthreads = Math.ceil(ns.hackAnalyzeThreads(target, returnmoney));
		let remaininghackthreads = Math.ceil(reqhackthreads);


		ns.clearLog();
		ns.print("ServerMoneyAvailable:   " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("ServerMaxMoney:         " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Money per hack cycle:   " + dollarUS.format(returnmoney));
		ns.print("ServerSecurityLevel:    " + ns.getServerSecurityLevel(target));
		ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
		ns.print("Usable servers length:  " + usableservers.length);
		ns.print("Hack threads:           " + reqhackthreads);
		// visual test to see if it's still looping
		ns.print(Math.floor(Math.random() * 1000));


		if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
			usableserversthreadsavailable = 0;
			hacktime = ns.getHackTime(target);
			for (let i = 0; i < usableservers.length; ++i) {
				await ns.sleep(20);

				// get usable ram and determine 
				usableserversfreeram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
				usableserversthreadsavailable = Math.ceil(usableserversfreeram / hackscriptram) - 2;
				if (usableserversthreadsavailable === 0) {
					continue;
				}
				if (remaininghackthreads === 0) {
					break;
				}

				ns.clearLog();
				ns.print("------HACK RUNNING------");
				ns.print("Running hack for        " + hacktime + " ms");
				ns.print("Thread available:       " + usableserversthreadsavailable);
				ns.print("Current security:       " + ns.getServerSecurityLevel(target));
				ns.print("Money available:        " + dollarUS.format(ns.getServerMoneyAvailable(target)));
				ns.print("Money to hack:          " + dollarUS.format(returnmoney));

				// if remaining threads is less than the host can run, do the last exec. otherwise run with max available
				// threads.
				if (usableserversthreadsavailable > remaininghackthreads) {
					pid = ns.exec("hack.js", usableservers[i], remaininghackthreads, target, hacktime);
					break;
				} else {
					pid = ns.exec("hack.js", usableservers[i], usableserversthreadsavailable, target, 0);
					remaininghackthreads = remaininghackthreads - usableserversthreadsavailable;
				}

				// if batch is running go to the next host
				if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, 0) === false) {
					continue;
				}
			}
			await ns.sleep(hacktime);
		} else {
			// set the threads
			let reqweakenthreads = 0;
			while (ns.weakenAnalyze(reqweakenthreads) < weakendecrease) { // 40 threads on joesguns
				reqweakenthreads++;
			}
			let reqgrowthreads = Math.ceil(ns.growthAnalyze(target, growthfactor));

			let remainingfirstweakenthreads = Math.ceil(reqweakenthreads);
			let remaininggrowthreads = Math.ceil(reqgrowthreads);
			let remainingsecondweakenthreads = Math.ceil(reqweakenthreads);


			// first weaken
			if (firstweakenrunning === false && growrunning === false && secondweakenrunning === false) {
				usableserversthreadsavailable = 0;
				for (let i = 0; i < usableservers.length; ++i) {
					await ns.sleep(20);

					// get usable ram and determine 
					usableserversfreeram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
					usableserversthreadsavailable = Math.ceil(usableserversfreeram / weakenscriptram) - 2;
					if (usableserversthreadsavailable === 0) {
						continue;
					}
					if (remainingfirstweakenthreads === 0) {
						break;
					}

					// if remaining threads is less than the host can run, do the last exec. otherwise run with max available
					// threads.
					if (usableserversthreadsavailable > remainingfirstweakenthreads) {
						pid = ns.exec("weaken1.js", usableservers[i], remainingfirstweakenthreads, target, hacktime);
						weakentime = ns.getWeakenTime(target) + sleepoffset;
						break;
					} else {
						pid = ns.exec("weaken1.js", usableservers[i], usableserversthreadsavailable, target, 0);
						remainingfirstweakenthreads = remainingfirstweakenthreads - usableserversthreadsavailable;
					}

					// if batch is running go to the next host
					if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, hacktime) === false) {
						continue;
					}
				}
				firstweakenrunning = true;
			}

			// grow
			if (firstweakenrunning === true && growrunning === false && secondweakenrunning === false) {
				usableserversthreadsavailable = 0;
				for (let i = 0; i < usableservers.length; ++i) {
					await ns.sleep(20);

					// get usable ram and determine 
					usableserversfreeram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
					usableserversthreadsavailable = Math.ceil(usableserversfreeram / growscriptram) - 2;
					if (usableserversthreadsavailable === 0) {
						continue;
					}
					if (remaininggrowthreads === 0) {
						break;
					}

					// if remaining threads is less than the host can run, do the last exec. otherwise run with max available
					// threads.
					if (usableserversthreadsavailable > remaininggrowthreads) {
						pid = ns.exec("grow.js", usableservers[i], remaininggrowthreads, target, (weakentime + hacktime));
						growtime = ns.getGrowTime(target) + sleepoffset;
						break;
					} else {
						pid = ns.exec("grow.js", usableservers[i], usableserversthreadsavailable, target, 0);
						remaininggrowthreads = remaininggrowthreads - usableserversthreadsavailable;
					}

					// if batch is running go to the next host
					if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, hacktime) === false) {
						continue;
					}
				}
				growrunning = true;
			}

			// second weaken
			if (firstweakenrunning === true && growrunning === true && secondweakenrunning === false) {
				usableserversthreadsavailable = 0;
				for (let i = 0; i < usableservers.length; ++i) {
					await ns.sleep(20);

					// get usable ram and determine 
					usableserversfreeram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
					usableserversthreadsavailable = Math.ceil(usableserversfreeram / weakenscriptram) - 2;
					if (usableserversthreadsavailable === 0) {
						continue;
					}
					if (remainingsecondweakenthreads === 0) {
						break;
					}

					// if remaining threads is less than the host can run, do the last exec. otherwise run with max available
					// threads.
					if (usableserversthreadsavailable > remainingsecondweakenthreads) {
						pid = ns.exec("weaken2.js", usableservers[i], remainingsecondweakenthreads, target, (weakentime + hacktime + growtime));
						weakentime = ns.getWeakenTime(target) + sleepoffset;
						break;
					} else {
						pid = ns.exec("weaken2.js", usableservers[i], usableserversthreadsavailable, target, 0);
						remainingsecondweakenthreads = remainingsecondweakenthreads - usableserversthreadsavailable;
					}

					// if batch is running go to the next host
					if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, hacktime) === false) {
						continue;
					}
				}
				secondweakenrunning = true;
			}

			ns.print("Big sleep for " + (weakentime + growtime + weakentime + sleepoffset) + " ms");
			await ns.sleep(weakentime + growtime + weakentime + sleepoffset);
			firstweakenrunning = false;
			growrunning = false;
			secondweakenrunning = false;
		}
	}

	ns.tprint("Script finished. This shouldnt happen.");
}