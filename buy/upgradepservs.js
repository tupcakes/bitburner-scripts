/**
 * Will do one upgrade pass on pservs if there are max number.
 */

 import { copyfiles } from "/libraries/utils.js";

 /** @param {NS} ns **/
 export async function main(ns) {
	 let pservs = ns.getPurchasedServers();
 
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
 
	 }
 }