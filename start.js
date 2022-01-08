/** @param {NS} ns **/
export async function main(ns) {
	ns.run("hack_ram.js");
	ns.run("hack_noram.js");

	// TODO
	// get tor node
	// get missing programs
	// add backdoor to get_root.js

	// if (ns.getServerMoneyAvailable("home") >= 1000000000) {
	// 	ns.run("buy/hacknet.js", 1, "buyNodes");
	// }
}