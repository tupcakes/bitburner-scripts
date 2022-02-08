/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();

	ns.travelToCity("Sector-12");
	let limit = ns.args[0];

	ns.tprint("Working out that bod...");
	while (ns.getPlayer().strength < limit) {
		ns.gymWorkout('Powerhouse Gym', 'strength');
		await ns.sleep(5000);
	}
	ns.stopAction();
	while (ns.getPlayer().defense < limit) {
		ns.gymWorkout('Powerhouse Gym', 'defense');
		await ns.sleep(5000);
	}
	ns.stopAction();
	while (ns.getPlayer().dexterity < limit) {
		ns.gymWorkout('Powerhouse Gym', 'dexterity');
		await ns.sleep(5000);
	}
	ns.stopAction();
	while (ns.getPlayer().agility < limit) {
		ns.gymWorkout('Powerhouse Gym', 'agility');
		await ns.sleep(5000);
	}
	ns.stopAction();


	
	ns.travelToCity("Volhaven");
    ns.tprint("Studying hacking...");
    while (ns.getPlayer().hacking < limit) {
        ns.universityCourse('ZB Institute of Technology', 'Algorithms');
        await ns.sleep(5000);
    }
	ns.stopAction();
    ns.tprint("Gaining charisma...");
    while (ns.getPlayer().charisma < limit) {
        ns.universityCourse('ZB Institute of Technology', 'Leadership');
        await ns.sleep(5000);
    }
	ns.stopAction();
}