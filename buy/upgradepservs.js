/**
 * Will do one upgrade pass on pservs if there are max number.
 */

 import { copyfiles } from "/libraries/utils.js";

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
 
	 let pservs = ns.getPurchasedServers();
	 let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
	 pservs.sort(collator.compare);
 
	 if (pservs.length !== ns.getPurchasedServerLimit()) {
		 ns.tprint("You don't have max servers.");
		 return;
	 }
 
	 // if the last server in the array doesn't have max ram, keep upgrading.
	 while (ns.getServerMaxRam(pservs[24]) !== ns.getPurchasedServerMaxRam()) {
		 let i = 0;
 
		 // do one pass of upgrading servers
		 while (i < ns.getPurchasedServerLimit()) {
			 await ns.sleep(20);
 
			 let currentserverram = ns.getServerMaxRam(pservs[i]);
			 let newram = currentserverram + currentserverram
			 let newservername = "pserv-" + i + "-" + newram + "GB"
 
			 // if server is already upgraded skip
			 if (ns.serverExists(newservername) === true || currentserverram > ns.getServerMaxRam(pservs[24])) {
				 i++;
				 continue;
			 }
 
 
			 ns.clearLog();
			 ns.print("Old server:        " + pservs[i]);
			 ns.print("Old ram:           " + currentserverram + " GB");
			 ns.print("New server:        " + newservername);
			 ns.print("New ram:           " + newram + " GB");
			 ns.print("Cost:              " + dollarUS.format(ns.getPurchasedServerCost(newram)));
			 ns.print("Money avaible:     " + dollarUS.format(ns.getServerMoneyAvailable("home")));
			 // visual test to see if it's still looping
			 ns.print(Math.floor(Math.random() * 1000));
 
 
			 // if we have enough money, upgrade the server
			 if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(newram)) {
				 if (ns.serverExists(newservername) === false) {
					 ns.killall(pservs[i]);
					 ns.deleteServer(pservs[i]);
					 ns.purchaseServer(newservername, newram);
					 await copyfiles(ns, newservername);
					 ns.tprint("Upgraded: " + newservername);
					 i++;
				 }
			 }
		 }
		 pservs = ns.getPurchasedServers();
	 }
 }