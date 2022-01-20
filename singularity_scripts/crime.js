/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
	let crime = 'Larceny';

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
		ns.commitCrime(crime);
		ns.print(ns.heart.break());
		await ns.sleep(crimetime);
	}
}