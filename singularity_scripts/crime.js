/** @param {NS} ns **/
export async function main(ns) {
	// ns.disableLog("ALL");
	ns.tail();

	// Crime options
	// const crimes = [
	//     "Shoplift",
	//     "RobStore",
	//     "Mug",
	//     "Larceny",
	//     "Drugs",
	//     "BondForgery",
	//     "TraffickArms",
	//     "Homicide",
	//     "GrandTheftAuto",
	//     "Kidnap",
	//     "Assassination",
	//     "Heist",
	// ];

	let loop = true;
	let crimetime = 0;
	const Homicidetime = JSON.parse(JSON.stringify(ns.getCrimeStats('Homicide'))).time;
	const Mugtime = JSON.parse(JSON.stringify(ns.getCrimeStats('Mug'))).time;

	// document.addEventListener('keypress', ({ key }) => {
	// 	if (key === 'Enter') {
	// 		loop = false;
	// 	}
	// })

	ns.stopAction();
	while (loop) {
		// create gang if ready. switch to best crime
		if (ns.heart.break() <= -54000) {
			ns.gang.createGang('Slum Snakes');
			ns.run('/gangs/tasks.js', 1);
			ns.spawn('/singularity_scripts/bestcrime.js');
		}

		// if homicide not good enough do mug
		if (ns.getCrimeChance('Homicide') < .9) {
			crimetime = Mugtime;
			ns.commitCrime('Mug');
		} else {
			crimetime = Homicidetime;
			ns.commitCrime('Homicide');
		}
		ns.print(ns.heart.break());
		await ns.sleep(crimetime);
	}
}