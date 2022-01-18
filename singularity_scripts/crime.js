/** @param {NS} ns **/
export async function main(ns) {
	ns.stopAction();
	while (true) {
		ns.commitCrime('Homicide');

		await ns.sleep(3500);
	}
}