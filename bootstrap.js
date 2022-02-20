/** @param {NS} ns **/
export async function main(ns) {
	// get home ram up to 128-256
	// get gang started
	// spawn start at end

	while (ns.getServerMaxRam('home') < 256) {
		ns.tail();
		await ns.sleep(20);
		
		// scan for contracts
		ns.run('contracts/contract-scanner.js');

		// buy ram for home if possible
		ns.upgradeHomeRam();

		// work towards gang
		// if we are in a gang crime.js is supposed to spawn required maint scripts
		if (ns.gang.inGang() === false) {
			ns.run('/singularity_scripts/crime.js');
		}
		ns.run('/earlygame/attack_local.js');
	}
	ns.run('start.js');
}