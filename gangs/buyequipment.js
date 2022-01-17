/** @param {NS} ns **/
export async function main(ns) {
	let ganginfo = ns.gang.getGangInformation();
	let gangmembers = ns.gang.getMemberNames();
	let equipmentnames = ns.gang.getEquipmentNames();
	let purchased = false;

	for (let i = 0; i < equipmentnames.length; ++i) {
		//ns.tprint(ns.gang.getEquipmentType(equipmentnames[i]));
		for (let j = 0; j < gangmembers.length; ++j) {
			// if hacking gang, buy rootkits
			if (ns.gang.getEquipmentType(equipmentnames[i]) === 'Rootkit' && ganginfo.isHacking === true) {
				purchased = ns.gang.purchaseEquipment(gangmembers[j], equipmentnames[i]);
				// if combat gang, buy combat equipment
			} else {
				purchased = ns.gang.purchaseEquipment(gangmembers[j], equipmentnames[i]);
			}
			if (purchased === true) {
				ns.tprint("Purchased: " + equipmentnames[i]);
			}
		}
	}
}