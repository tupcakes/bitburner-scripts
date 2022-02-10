/** @param {NS} ns **/
export async function lowerprice(ns, targetserver, targetsymbol) {
	let weakenram = ns.getScriptRam("/helpers/weakenstock.js");
	let hackram = ns.getScriptRam("/helpers/hackstock.js");
	let controllerram = ns.getScriptRam("/stocks/stock-controller.js");
	let sellerram = ns.getScriptRam("/stocks/seller.js");
	let buyerram = ns.getScriptRam("/stocks/buyer.js");
	let dashram = ns.getScriptRam("/stocks/dash-stocks.js");
	let mainpram = ns.getScriptRam("/stocks/simple-manip.js");
	let rootallram = ns.getScriptRam("root-all.js");
	let ramoverhead = (sellerram + + buyerram + controllerram + dashram + mainpram + rootallram) - 2;

	let weakenthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / weakenram) / 2);
	let hackthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / hackram) / 2);

	let timeoffset = 500;
	let hacktime = 0;

	while (ns.stock.getPosition(targetsymbol)[0] > 0) {
		await ns.sleep(20);

		let weakentime = ns.getWeakenTime(targetserver) + timeoffset;
		hacktime = ns.getHackTime(targetserver) + timeoffset;

		ns.run('/helpers/weakenstock.js', weakenthreads, targetserver, 0);
		await ns.sleep(weakentime);

		ns.run('/helpers/hackstock.js', hackthreads, targetserver, 0);
		await ns.sleep(hacktime);
	}
}


/** @param {NS} ns **/
export async function raiseprice(ns, targetserver, targetsymbol) {
	let weakenram = ns.getScriptRam("/helpers/weaken1.js");
	let growram = ns.getScriptRam("/helpers/growstock.js");
	let hackram = ns.getScriptRam("/helpers/hack.js");
	let controllerram = ns.getScriptRam("/stocks/stock-controller.js");
	let sellerram = ns.getScriptRam("/stocks/seller.js");
	let buyerram = ns.getScriptRam("/stocks/buyer.js");
	let dashram = ns.getScriptRam("/stocks/dash-stocks.js");
	let mainpram = ns.getScriptRam("/stocks/simple-manip.js");
	let rootallram = ns.getScriptRam("root-all.js");
	let ramoverhead = (sellerram + + buyerram + controllerram + dashram + mainpram + rootallram) - 2;

	let weakenthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / weakenram) / 2);
	let growthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / growram) / 2);
	let hackthreads = parseInt(((ns.getServerMaxRam('home') - ramoverhead) / hackram) / 2);

	let timeoffset = 500;
	let weakentime = 0;


	while (ns.stock.getPosition(targetsymbol)[0] !== 0) {
		await ns.sleep(20);

		weakentime = ns.getWeakenTime(targetserver) + timeoffset;
		let growtime = ns.getGrowTime(targetserver) + timeoffset;
		let hacktime = ns.getHackTime(targetserver) + timeoffset;

		ns.run('/helpers/weaken1.js', weakenthreads, targetserver, 0);
		await ns.sleep(weakentime);

		ns.run('/helpers/growstock.js', growthreads, targetserver, 0);
		await ns.sleep(growtime);

		// ns.run('/helpers/weaken2.js', weakenthreads, targetserver, 0);
		// await ns.sleep(weakentime);

		// ns.run('/helpers/hack.js', hackthreads, targetserver, 0);
		// await ns.sleep(hacktime);
	}
}


/** @param {NS} ns **/
export async function lowerpricepserv(ns, target, targetsymbol, targetprice) {
}


/** @param {NS} ns **/
export async function raisepricepserv(ns, target, targetsymbol, targetprice) {
}




/** @param {NS} ns **/
export async function lowerpricedist(ns, target, targetsymbol, targetprice) {
	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	// let file = ns.read("server_list.txt");
	// let rootableservers = file.split("\r\n");
	let rootableservers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	// multipliers - ADJUST THIS
	let weakenmultiplier = .2;
	let growmultiplier = 1.15;
	let hackmultiplier = 1.8;
	let moneymultiplier = .20;


	let sleepoffset = 2000;
	let hacktime = 0;
	let weakentime = 0;
	let growtime = 0;

	let weakenscriptram = ns.getScriptRam('/helpers/weakenstock.js');
	let growscriptram = ns.getScriptRam('/helpers/grow.js');
	let hackscriptram = ns.getScriptRam('/helpers/hackstock.js');
	let scriptram = weakenscriptram + growscriptram + hackscriptram;

	let usableserversthreadsavailable = 0;

	let firstweakenrunning = false;
	let growrunning = false;
	let secondweakenrunning = false;
	let usableserversfreeram = 0;
	let pid = null;


	while (ns.stock.getPrice(targetsymbol) > targetprice) {
		await ns.sleep(20);

		// build list of usable servers
		let usableservers = [];

		let pservs = ns.getPurchasedServers();
		// add all rootable servers that have ram and we have root on
		for (const rootableserver of rootableservers) {
			if (ns.getServerMaxRam(rootableserver.name) > 0 && ns.hasRootAccess(rootableserver.name)) {
				usableservers.push(rootableserver.name);
			}
		}
		for (const pserv of pservs) {
			usableservers.push(pserv);
		}
		//usableservers.push("home");

		// get ram of all usableservers
		let totalram = 0;
		for (const usableserver of usableservers) {
			totalram = totalram + ns.getServerMaxRam(usableserver);
		}
		// subtrack room for one instance of each script as a buffer.
		let maxnumthreads = Math.floor((totalram - scriptram) / scriptram);


		// let reqhackthreads = Math.max(1, ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) * moneymultiplier)));
		// // hackthreads returned a value less than 1
		// if (target == 'n00dles') {
		// 	reqhackthreads = Math.max(1, ns.hackAnalyzeThreads(target, (ns.getServerMaxMoney(target) - 70000)));
		// }
		
		let reqhackthreads = Math.ceil(maxnumthreads * hackmultiplier);

		let moneyperhack = (ns.getServerMaxMoney(target) * ns.hackAnalyze(target)) * reqhackthreads;		
		let remaininghackthreads = Math.ceil(reqhackthreads);


		ns.clearLog();
		ns.print("ServerMoneyAvailable:   " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("ServerMaxMoney:         " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("Money per hack cycle:   " + dollarUS.format(moneyperhack));
		ns.print("ServerSecurityLevel:    " + ns.getServerSecurityLevel(target));
		ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
		ns.print("Usable servers length:  " + usableservers.length);
		ns.print("Hack threads:           " + reqhackthreads);
		// visual test to see if it's still looping
		ns.print(Math.floor(Math.random() * 1000));


		// if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target) && ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
		if (ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
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
				ns.print("Money to hack:          " + dollarUS.format(moneyperhack));

				// if remaining threads is less than the host can run, do the last exec. otherwise run with max available
				// threads.
				if (usableserversthreadsavailable > remaininghackthreads) {
					pid = ns.exec("/helpers/hackstock.js", usableservers[i], remaininghackthreads, target, hacktime);
					break;
				} else {
					pid = ns.exec("/helpers/hackstock.js", usableservers[i], usableserversthreadsavailable, target, 0);
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
			let reqweakenthreads = Math.ceil(maxnumthreads * weakenmultiplier);
			let reqgrowthreads = Math.ceil(maxnumthreads * growmultiplier);


			let remainingfirstweakenthreads = Math.ceil(reqweakenthreads);
			let remaininggrowthreads = Math.ceil(reqgrowthreads);
			let remainingsecondweakenthreads = Math.ceil(reqweakenthreads);


			// first weaken
			//if (firstweakenrunning === false && growrunning === false && secondweakenrunning === false) {
			if (firstweakenrunning === false) {
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
						pid = ns.exec("/helpers/weaken1stock.js", usableservers[i], remainingfirstweakenthreads, target, hacktime);
						weakentime = ns.getWeakenTime(target) + sleepoffset;
						break;
					} else {
						pid = ns.exec("/helpers/weaken1stock.js", usableservers[i], usableserversthreadsavailable, target, hacktime);
						remainingfirstweakenthreads = remainingfirstweakenthreads - usableserversthreadsavailable;
					}

					// if batch is running go to the next host
					if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, hacktime) === false) {
						continue;
					}
				}
				firstweakenrunning = true;
			}

			// // grow
			// if (firstweakenrunning === true && growrunning === false && secondweakenrunning === false) {
			// 	usableserversthreadsavailable = 0;
			// 	for (let i = 0; i < usableservers.length; ++i) {
			// 		await ns.sleep(20);

			// 		// get usable ram and determine 
			// 		usableserversfreeram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
			// 		usableserversthreadsavailable = Math.ceil(usableserversfreeram / growscriptram) - 2;
			// 		if (usableserversthreadsavailable === 0) {
			// 			continue;
			// 		}
			// 		if (remaininggrowthreads === 0) {
			// 			break;
			// 		}

			// 		// if remaining threads is less than the host can run, do the last exec. otherwise run with max available
			// 		// threads.
			// 		if (usableserversthreadsavailable > remaininggrowthreads) {
			// 			pid = ns.exec("/helpers/grow.js", usableservers[i], remaininggrowthreads, target, (weakentime + hacktime));
			// 			growtime = ns.getGrowTime(target) + sleepoffset;
			// 			break;
			// 		} else {
			// 			pid = ns.exec("/helpers/grow.js", usableservers[i], usableserversthreadsavailable, target, (weakentime + hacktime));
			// 			remaininggrowthreads = remaininggrowthreads - usableserversthreadsavailable;
			// 		}

			// 		// if batch is running go to the next host
			// 		if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, (weakentime + hacktime)) === false) {
			// 			continue;
			// 		}
			// 	}
			// 	growrunning = true;
			// }

			// // second weaken
			// if (firstweakenrunning === true && growrunning === true && secondweakenrunning === false) {
			// 	usableserversthreadsavailable = 0;
			// 	for (let i = 0; i < usableservers.length; ++i) {
			// 		await ns.sleep(20);

			// 		// get usable ram and determine 
			// 		usableserversfreeram = ns.getServerMaxRam(usableservers[i]) - ns.getServerUsedRam(usableservers[i]);
			// 		usableserversthreadsavailable = Math.ceil(usableserversfreeram / weakenscriptram) - 2;
			// 		if (usableserversthreadsavailable === 0) {
			// 			continue;
			// 		}
			// 		if (remainingsecondweakenthreads === 0) {
			// 			break;
			// 		}

			// 		// if remaining threads is less than the host can run, do the last exec. otherwise run with max available
			// 		// threads.
			// 		if (usableserversthreadsavailable > remainingsecondweakenthreads) {
			// 			pid = ns.exec("/helpers/weaken2stock.js", usableservers[i], remainingsecondweakenthreads, target, (weakentime + hacktime + growtime));
			// 			weakentime = ns.getWeakenTime(target) + sleepoffset;
			// 			break;
			// 		} else {
			// 			pid = ns.exec("/helpers/weaken2stock.js", usableservers[i], usableserversthreadsavailable, target, (weakentime + hacktime + growtime));
			// 			remainingsecondweakenthreads = remainingsecondweakenthreads - usableserversthreadsavailable;
			// 		}

			// 		// if batch is running go to the next host
			// 		if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, (weakentime + hacktime + growtime)) === false) {
			// 			continue;
			// 		}
			// 	}
			// 	secondweakenrunning = true;
			// }

			ns.print("Big sleep for " + (weakentime + growtime + sleepoffset) + " ms");
			await ns.sleep(weakentime + growtime + sleepoffset);
			firstweakenrunning = false;
			growrunning = false;
			secondweakenrunning = false;
		}
	}
}


/** @param {NS} ns **/
export async function raisepricedist(ns, target, targetsymbol, targetprice) {
	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();

	// let file = ns.read("server_list.txt");
	// let rootableservers = file.split("\r\n");
	let rootableservers = JSON.parse(ns.read("serversbyhacklvl.json.txt"));

	// multipliers - ADJUST THIS
	let weakenmultiplier = .1;
	let growmultiplier = 1.9;


	let sleepoffset = 2000;
	let weakentime = 0;
	let growtime = 0;

	let weakenscriptram = ns.getScriptRam('/helpers/weaken1.js');
	let growscriptram = ns.getScriptRam('/helpers/growstock.js');
	let scriptram = weakenscriptram + growscriptram;

	let usableserversthreadsavailable = 0;

	let usableserversfreeram = 0;
	let pid = null;


	//while (ns.stock.getPrice(targetsymbol) < targetprice) {
	while (ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)) {
		await ns.sleep(20);

		// build list of usable servers
		let usableservers = [];

		let pservs = ns.getPurchasedServers();
		// add all rootable servers that have ram and we have root on
		for (const rootableserver of rootableservers) {
			if (ns.getServerMaxRam(rootableserver.name) > 0 && ns.hasRootAccess(rootableserver.name)) {
				usableservers.push(rootableserver.name);
			}
		}
		for (const pserv of pservs) {
			usableservers.push(pserv);
		}
		//usableservers.push("home");

		// get ram of all usableservers
		let totalram = 0;
		for (const usableserver of usableservers) {
			totalram = totalram + ns.getServerMaxRam(usableserver);
		}
		// subtrack room for one instance of each script as a buffer.
		let maxnumthreads = Math.floor((totalram - scriptram) / scriptram);


		// set the threads
		let reqweakenthreads = Math.ceil(maxnumthreads * weakenmultiplier);
		let reqgrowthreads = Math.ceil(maxnumthreads * growmultiplier);

		let remainingfirstweakenthreads = Math.ceil(reqweakenthreads);
		let remaininggrowthreads = Math.ceil(reqgrowthreads);


		// first weaken
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
				pid = ns.exec("/helpers/weaken1.js", usableservers[i], remainingfirstweakenthreads, target, growtime);
				weakentime = ns.getWeakenTime(target) + sleepoffset;
				break;
			} else {
				pid = ns.exec("/helpers/weaken1.js", usableservers[i], usableserversthreadsavailable, target, growtime);
				remainingfirstweakenthreads = remainingfirstweakenthreads - usableserversthreadsavailable;
			}

			// if batch is running go to the next host
			if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, growtime) === false) {
				continue;
			}
		}
		

		// grow
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
				pid = ns.exec("/helpers/growstock.js", usableservers[i], remaininggrowthreads, target, (weakentime + growtime));
				growtime = ns.getGrowTime(target) + sleepoffset;
				break;
			} else {
				pid = ns.exec("/helpers/growstock.js", usableservers[i], usableserversthreadsavailable, target, (weakentime + growtime));
				remaininggrowthreads = remaininggrowthreads - usableserversthreadsavailable;
			}

			// if batch is running go to the next host
			if (ns.isRunning(pid, usableservers[i], usableserversthreadsavailable, target, (weakentime + growtime)) === false) {
				continue;
			}
		}


		ns.clearLog();
		ns.print("ServerMoneyAvailable:   " + dollarUS.format(ns.getServerMoneyAvailable(target)));
		ns.print("ServerMaxMoney:         " + dollarUS.format(ns.getServerMaxMoney(target)));
		ns.print("ServerSecurityLevel:    " + ns.getServerSecurityLevel(target));
		ns.print("ServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
		ns.print("Usable servers length:  " + usableservers.length);
		ns.print("Ram in use:             " + ((reqweakenthreads * weakenscriptram) + (reqgrowthreads* growscriptram)));
		// visual test to see if it's still looping
		ns.print(Math.floor(Math.random() * 1000));


		ns.print("Big sleep for " + (weakentime + growtime + sleepoffset) + " ms");
		await ns.sleep(weakentime + growtime + sleepoffset);
	}
}