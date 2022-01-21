/** @param {NS} ns **/
export async function main(ns) {
	// ns.disableLog("ALL");
	ns.tail();
	let crime = 'Homicide';

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

	let loop = true
	const crimetime = JSON.parse(JSON.stringify(ns.getCrimeStats(crime))).time;

	// document.addEventListener('keypress', ({ key }) => {
	// 	if (key === 'Enter') {
	// 		loop = false;
	// 	}
	// })

	ns.stopAction();
	while (loop) {
		if (ns.heart.break() <= -54000) {
			ns.spawn('/singularity_scripts/bestcrime.js');
		}

		// if homicide not good enough do mug
		if (ns.getCrimeChance('Homicide') < .9) {
			ns.commitCrime('Mug');
		} else {
			ns.commitCrime('Homicide');
		}
		ns.print(ns.heart.break());
		await ns.sleep(crimetime);
	}
}