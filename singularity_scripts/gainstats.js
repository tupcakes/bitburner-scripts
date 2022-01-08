/** @param {NS} ns **/
export async function main(ns) {
	ns.stopAction();
	ns.travelToCity("Sector-12");
	let target = ns.args[0];

	ns.tprint("Working out that bod...");
	while (ns.getPlayer().strength < target) {
		ns.gymWorkout('Powerhouse Gym', 'strength');
		await ns.sleep(5000);
	}
	while (ns.getPlayer().defense < target) {
		ns.gymWorkout('Powerhouse Gym', 'defense');
		await ns.sleep(5000);
	}
	while (ns.getPlayer().dexterity < target) {
		ns.gymWorkout('Powerhouse Gym', 'dexterity');
		await ns.sleep(5000);
	}
	while (ns.getPlayer().agility < target) {
		ns.gymWorkout('Powerhouse Gym', 'agility');
		await ns.sleep(5000);
	}

    ns.tprint("Studying hacking...");
    while (ns.getPlayer().hacking < limit) {
        ns.universityCourse('ZB Institute of Technology', 'Algorithms');
        await ns.sleep(5000);
    }
    ns.tprint("Gaining charisma...");
    while (ns.getPlayer().charisma < limit) {
        ns.universityCourse('ZB Institute of Technology', 'Leadership');
        await ns.sleep(5000);
    }
}