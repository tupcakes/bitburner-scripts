/** @param {NS} ns **/
export async function main(ns) {

	// How much RAM each purchased server will have.
	var ram = 64;

	// Iterator we'll use for our loop
	var i = 0;
	// Continuously try to purchase servers until we've reached the maximum
	// amount of servers
	while (i < ns.getPurchasedServerLimit()) {
		// Check if we haMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
		// If we have enough money, then:
		//  1. Purchase the server
		//  2. Copy our hacking script onto the newly-purchased server
		//  3. Run our hacking script on the newly-purchased server with 3 threads
		//  4. Increment our iterator to indicate that we've bought a new server

		var servername = "pserv-" + ram + "GB-" + i
		var serv = ns.purchaseServer(servername, ram);

		i++;
	}
	await ns.sleep(3000);
}