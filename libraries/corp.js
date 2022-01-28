/** THIS REQUIRES A TON OF RAM
 * start corp
 * Create ag division
 * buy smart supply
 * enable smart supply
 * expand office to each city
 * for each city
 *   hire 3 employees
 *   assign 1 to operations, engineer, and business
 * for each city
 *   buy 1 advert inc
 * for each city
 *   upgrade office storage to 300
 * for each city
 *   sell plants and food
 *     MAX/MP
 * 
 */

/** @param {NS} ns **/
export function bootstrapAg(ns) {
	createcorp(ns, 'Bit');

	// create division
	ns.corporation.expandIndustry('Agriculture', 'Ag');

	// Buy smart supply

}


/** @param {NS} ns **/
export function createcorp(ns, name) {
	if (ns.getPlayer().bitNodeN === 3) {
		ns.corporation.createCorporation(name, true);
	} else {
		if (ns.getServerMoneyAvailable('home' >= 150000000000) && ns.getPlayer().bitNodeN !== 3) {
			ns.corporation.createCorporation(name, false);
		} else {
			ns.tprint("Not enough money. You need $150,000,000,000.");
		}
	}
}