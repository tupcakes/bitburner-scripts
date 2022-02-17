/** @param {NS} ns **/
export async function growstocks(ns, target) {
	// WG

	let weakenscriptram = ns.getScriptRam('/helpers/weaken.js');
	let growscriptram = ns.getScriptRam('/helpers/grow.js');
	let hackscriptram = ns.getScriptRam('/helpers/hack.js');
	let hackmultiplier = .75;
	let weakenthreadsrequired = getweakenthreads(ns, target);
	let weakenthreadsremaining = weakenthreadsrequired;
	let growthreadsrequired = getgrowthreads(ns, target);
	let growthreadsremaining = growthreadsrequired;
	let hackthreadsrequired = gethackthreads(ns, target, hackmultiplier);
	let hackthreadsremaining = hackthreadsrequired;
	let sleeptime = 0;

	// update server list
	let usableservers = [];
	ns.run('createserverlist.js');
	let serverlist = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	for (const server of serverlist) {
		if (server.maxram > 0 && server.hackinglevel <= ns.getHackingLevel()) {
			usableservers.push(server);
		}
	}

	// WEAKEN
	if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
		threadloop:
		while (weakenthreadsremaining > 0) {
			showstats(ns, target, usableservers, "Weaken", weakenthreadsrequired, weakenthreadsremaining)
			await ns.sleep(20);
			usableserversloop:
			for (let i = 0; i < usableservers.length; ++i) {
				await ns.sleep(20);
				let freeram = getfreeram(ns, usableservers[i].name);
				if (freeram < weakenscriptram) {
					continue usableserversloop;
				}
				let maxthreadsonhost = Math.floor(freeram / weakenscriptram);

				if (weakenthreadsremaining <= maxthreadsonhost) {
					ns.exec('/helpers/weaken.js', usableservers[i].name, weakenthreadsremaining, target, 0);
					weakenthreadsremaining = weakenthreadsremaining - maxthreadsonhost;
					break threadloop;
				} else if (weakenthreadsremaining > 0) {
					ns.exec('/helpers/weaken.js', usableservers[i].name, maxthreadsonhost, target, 0);
					weakenthreadsremaining = weakenthreadsremaining - maxthreadsonhost;
				}
			}
		}
		sleeptime = ns.getWeakenTime(target);
		await ns.sleep(sleeptime);
	}

	// GROW
	if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
		threadloop:
		while (growthreadsremaining > 0) {
			showstats(ns, target, usableservers, "Grow", growthreadsrequired, growthreadsremaining);
			await ns.sleep(20);
			usableserversloop:
			for (let i = 0; i < usableservers.length; ++i) {
				await ns.sleep(20);
				let freeram = getfreeram(ns, usableservers[i].name);
				if (freeram < growscriptram) {
					continue usableserversloop;
				}
				let maxthreadsonhost = Math.floor(freeram / growscriptram);

				if (growthreadsremaining <= maxthreadsonhost && growthreadsremaining > 0) {
					ns.exec('/helpers/grow.js', usableservers[i].name, growthreadsremaining, target, 0);
					growthreadsremaining = growthreadsremaining - maxthreadsonhost;
					break threadloop;
				} else {
					ns.exec('/helpers/grow.js', usableservers[i].name, maxthreadsonhost, target, 0);
					growthreadsremaining = growthreadsremaining - maxthreadsonhost;
				}
				// if no more usable servers exit loop
				if (i === usableservers.length - 1) {
					sleeptime = ns.getGrowTime(target);
					await ns.sleep(sleeptime);
					break threadloop;
				}
			}
		}
		sleeptime = ns.getGrowTime(target);
		await ns.sleep(sleeptime);
	}
}

/** @param {NS} ns **/
export async function weakenstocks(ns, target) {
	// WH

	let weakenscriptram = ns.getScriptRam('/helpers/weaken.js');
	let growscriptram = ns.getScriptRam('/helpers/grow.js');
	let hackscriptram = ns.getScriptRam('/helpers/hack.js');
	let hackmultiplier = .75;
	let weakenthreadsrequired = getweakenthreads(ns, target);
	let weakenthreadsremaining = weakenthreadsrequired;
	let growthreadsrequired = getgrowthreads(ns, target);
	let growthreadsremaining = growthreadsrequired;
	let hackthreadsrequired = gethackthreads(ns, target, hackmultiplier);
	let hackthreadsremaining = hackthreadsrequired;
	let sleeptime = 0;

	// update server list
	let usableservers = [];
	ns.run('createserverlist.js');
	let serverlist = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	for (const server of serverlist) {
		if (server.maxram > 0 && server.hackinglevel <= ns.getHackingLevel()) {
			usableservers.push(server);
		}
	}

	// WEAKEN
	if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
		threadloop:
		while (weakenthreadsremaining > 0) {
			showstats(ns, target, usableservers, "Weaken", weakenthreadsrequired, weakenthreadsremaining)
			await ns.sleep(20);
			usableserversloop:
			for (let i = 0; i < usableservers.length; ++i) {
				await ns.sleep(20);
				let freeram = getfreeram(ns, usableservers[i].name);
				if (freeram < weakenscriptram) {
					continue usableserversloop;
				}
				let maxthreadsonhost = Math.floor(freeram / weakenscriptram);

				if (weakenthreadsremaining <= maxthreadsonhost) {
					ns.exec('/helpers/weaken.js', usableservers[i].name, weakenthreadsremaining, target, 0);
					weakenthreadsremaining = weakenthreadsremaining - maxthreadsonhost;
					break threadloop;
				} else if (weakenthreadsremaining > 0) {
					ns.exec('/helpers/weaken.js', usableservers[i].name, maxthreadsonhost, target, 0);
					weakenthreadsremaining = weakenthreadsremaining - maxthreadsonhost;
				}
			}
		}
		sleeptime = ns.getWeakenTime(target);
		await ns.sleep(sleeptime);
	}

	// HACK
	if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
		threadloop:
		while (hackthreadsremaining > 0) {
			showstats(ns, target, usableservers, "Hack", hackthreadsrequired, hackthreadsremaining);
			await ns.sleep(20);
			usableserversloop:
			for (let i = 0; i < usableservers.length; ++i) {
				await ns.sleep(20);
				let freeram = getfreeram(ns, usableservers[i].name);
				if (freeram < hackscriptram) {
					continue usableserversloop;
				}
				let maxthreadsonhost = Math.floor(freeram / hackscriptram);

				if (hackthreadsremaining <= maxthreadsonhost && hackthreadsremaining > 0) {
					ns.exec('/helpers/hack.js', usableservers[i].name, hackthreadsremaining, target, 0);
					hackthreadsremaining = hackthreadsremaining - maxthreadsonhost;
					return;
				} else {
					ns.exec('/helpers/hack.js', usableservers[i].name, maxthreadsonhost, target, 0);
					hackthreadsremaining = hackthreadsremaining - maxthreadsonhost;
				}
				// if no more usable servers exit loop
				if (i === usableservers.length - 1) {
					sleeptime = ns.getGrowTime(target);
					await ns.sleep(sleeptime);
					return;
				}
			}
		}
		sleeptime = ns.getHackTime(target);
		await ns.sleep(sleeptime);
	}
}


/** @param {NS} ns **/
export function getgrowthreads(ns, target) {
	let growmoneyuntilmax = ns.getServerMaxMoney(target) - ns.getServerMoneyAvailable(target);
	if (growmoneyuntilmax === 0) {
		return -1;
	}
	return Math.ceil(ns.growthAnalyze(target, growmoneyuntilmax));
}

/** @param {NS} ns **/
export function gethackthreads(ns, target, hackmultiplier) {
	if (hackmultiplier > 1) {
		ns.tprint("Hack multiplier must be less than 1.");
		return -1;
	}
	return Math.ceil((ns.getServerMaxMoney(target) * hackmultiplier) / ns.hackAnalyze(target));
}

/** @param {NS} ns **/
export function getweakenthreads(ns, target) {
	if ((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) === 0) {
		return 0;
	} else {
		return Math.ceil((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / ns.weakenAnalyze(1));
	}
}

/** @param {NS} ns **/
export function getfreeram(ns, target) {
	return ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
}

/** @param {NS} ns **/
export function showstats(ns, target, usableservers, operation, threadsrequired, threadsremaining) {
	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	ns.clearLog();
	ns.print("Running:                " + operation);
	ns.print("ServerMoneyAvailable:   " + dollarUS.format(ns.getServerMoneyAvailable(target)));
	ns.print("ServerMaxMoney:         " + dollarUS.format(ns.getServerMaxMoney(target)));
	ns.print("ServerSecurityLevel:    " + ns.getServerSecurityLevel(target));
	ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
	ns.print("Usable servers length:  " + usableservers.length);
	ns.print("Threads required:       " + threadsrequired);
	//ns.print("Threads remaining:      " + threadsremaining);
	ns.print(Math.floor(Math.random() * 1000));
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	// ns.enableLog('exec');
	ns.clearLog();

	while (true) {
		await ns.sleep(50);
		var growStockPort = ns.getPortHandle(1); // port 1 is grow
		var hackStockPort = ns.getPortHandle(2); // port 2 is hack

		let growserver = growStockPort.read();
		let hackserver = hackStockPort.read();
		if (growserver === 'NULL PORT DATA' || hackserver === 'NULL PORT DATA') {
			continue;
		} else {
			if (growserver !== 'NULL PORT DATA') {
				if (ns.getServerRequiredHackingLevel(growserver) <= ns.getHackingLevel()) {
					growstocks(ns, growserver);
				}
			}
			if (hackserver !== 'NULL PORT DATA') {
				if (ns.getServerRequiredHackingLevel(growserver) <= ns.getHackingLevel()) {
					weakenstocks(ns, hackserver);
				}
			}
		}
	}
}