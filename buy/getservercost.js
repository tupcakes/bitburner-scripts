/** @param {NS} ns **/
export async function main(ns) {
	let size = ns.args[0];
	let number = 1;
	number = ns.args[1];
	let cost = ns.getPurchasedServerCost(size, number);
	let dollarUS = Intl.NumberFormat("en-US", {
    	style: "currency",
    	currency: "USD",
		maximumFractionDigits: 0,
	});
	
	ns.tprint(dollarUS.format(cost));
}